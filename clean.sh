#!/bin/bash

gulp codegen
gulp mvn:clean
gulp mysql:clean
gulp codegen:clean
