#!/bin/bash

cd /workspaces/Inventory-Dashboard/backend
python manage.py runserver 0.0.0.0:8000 > /tmp/django.log 2>&1 &

cd /workspaces/Inventory-Dashboard/frontend
npm run dev -- --host 0.0.0.0 > /tmp/vite.log 2>&1 &
