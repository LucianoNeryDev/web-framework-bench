# Source on the load-generator VM before running the harness: bench/cloud/env.sh <target-internal-ip>
export WFB_TARGET_SSH=wfb-target          # ~/.ssh/config host for the target VM
export WFB_TARGET_IP=${1:?target VM internal IP}
export WFB_TARGET_CPUS=0,1                # the whole 2-vCPU target VM
export WFB_CLIENT_CPUS=0-3                # the whole 4-vCPU load-generator VM
