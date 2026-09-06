-- Migration 002: pin support + per-project AI settings
-- Run this in Supabase SQL Editor AFTER schema.sql (safe to run even if
-- columns already exist thanks to IF NOT EXISTS).

alter table public.projects
  add column if not exists pinned boolean not null default false;

alter table public.projects
  add column if not exists settings jsonb not null default '{
    "persona": "mentor",
    "experienceLevel": "beginner",
    "language": "id",
    "projectType": "web"
  }'::jsonb;