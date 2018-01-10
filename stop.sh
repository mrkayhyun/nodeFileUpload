#!/bin/sh
kill -9 `ps -ef | grep 'node app' | awk '{print $2}'`
