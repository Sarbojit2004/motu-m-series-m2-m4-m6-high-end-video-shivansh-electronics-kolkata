#!/bin/sh
# Puts motu-m-series-reel.mp4 back together. Run from inside this directory.
set -e
cat motu-m-series-reel.mp4.part* > motu-m-series-reel.mp4
echo "c7ff609d06195e62982e82c61de287fd42cde0c4e968e23aab0c5d55ea9286ea  motu-m-series-reel.mp4" | sha256sum -c -
