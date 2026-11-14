#!/usr/bin/env bash
# Delete the benchmark VMs (copy results/ off the load generator first).
set -euo pipefail
G=${GCLOUD:-gcloud}
$G compute instances delete wfb-target wfb-loadgen --zone="${ZONE:-europe-west8-a}" --quiet
