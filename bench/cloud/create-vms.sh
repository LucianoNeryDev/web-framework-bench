#!/usr/bin/env bash
# Create the two benchmark VMs and prepare them. Run from a workstation with gcloud.
#   GCLOUD="gcloud --configuration=<cfg>" ZONE=europe-west8-a bench/cloud/create-vms.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
G=${GCLOUD:-gcloud}; Z=--zone=${ZONE:-europe-west8-a}
create() { # name type disk role
  $G compute instances create "$1" $Z --machine-type="$2" --image-family=debian-13 --image-project=debian-cloud \
    --boot-disk-size="$3" --boot-disk-type=pd-balanced --metadata=wfb-role="$4" \
    --metadata-from-file=startup-script=bench/cloud/startup.sh --labels=project=web-framework-bench
}
create wfb-target n2-standard-2 60GB target
create wfb-loadgen n2-standard-4 40GB loadgen

# Ship the repository (current branch) to both VMs.
bundle=$(mktemp --suffix=.bundle); git bundle create "$bundle" HEAD
for vm in wfb-target wfb-loadgen; do
  $G compute scp $Z "$bundle" "$vm:wfb.bundle"
  $G compute ssh "$vm" $Z --command 'until test -f /var/lib/wfb-ready; do sleep 5; done
    sudo usermod -aG docker $USER; rm -rf web-framework-bench; git clone -q wfb.bundle web-framework-bench'
done
rm -f "$bundle"

# The load generator drives the target over SSH.
target_ip=$($G compute instances describe wfb-target $Z --format='value(networkInterfaces[0].networkIP)')
pub=$($G compute ssh wfb-loadgen $Z --command "test -f ~/.ssh/id_ed25519 || ssh-keygen -q -t ed25519 -N '' -f ~/.ssh/id_ed25519
  printf 'Host wfb-target\n  HostName $target_ip\n  StrictHostKeyChecking accept-new\n' > ~/.ssh/config; cat ~/.ssh/id_ed25519.pub" | tail -1)
keys=$(mktemp); echo "$USER:$pub" > "$keys"
$G compute instances add-metadata wfb-target $Z --metadata-from-file=ssh-keys="$keys"; rm -f "$keys"

# Harness dependencies on the load generator.
$G compute ssh wfb-loadgen $Z --command 'cd web-framework-bench && bench/setup.sh && (cd bench && sudo npx -y playwright install-deps chromium) && docker pull -q nginx:1.30-alpine && sudo loginctl enable-linger $USER'
echo "Ready. On wfb-loadgen: cd web-framework-bench && source bench/cloud/env.sh $target_ip && bench/run-all.sh"
