#!/bin/sh
# Puts motu-m-series-explainer.mp4 back together. Run from inside this directory.
set -e
cat motu-m-series-explainer.mp4.part* > motu-m-series-explainer.mp4
echo "b885125f8a05a5fb7272e35153e788f8c91667b7f64e7f4dadabec555751ebb5  motu-m-series-explainer.mp4" | sha256sum -c -
