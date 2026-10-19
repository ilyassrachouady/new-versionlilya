# Connexion Supabase

## 1. Variables locales

Copier `.env.example` vers `.env.local`, puis renseigner les valeurs affichées dans **Supabase → Connect** :

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

La clé `SUPABASE_SECRET_KEY` reste exclusivement côté serveur. Elle ne doit jamais utiliser le préfixe `NEXT_PUBLIC_`.

## 2. Créer le schéma

Dans l’éditeur SQL Supabase, exécuter dans cet ordre :

1. `migrations/20261011000000_initial_schema.sql`
2. `seed.sql` pour importer le catalogue de démonstration

Le schéma active RLS sur toutes les tables exposées. Les produits, collections et contenus publiés sont lisibles publiquement ; les données clients, commandes et stocks restent privées.

## 3. Connexion administrateur par lien

Le bureau (`/admin`) n’accepte plus l’accès anonyme. Un e-mail autorisé reçoit un lien unique ; il n’y a pas de mot de passe.

Dans **Authentication → Providers → Email**, activer Magic link. Dans **Authentication → URL Configuration**, ajouter :

```
http://localhost:3000/auth/callback
https://votre-domaine/auth/callback
```

Créer l’utilisateur dans **Authentication → Users**. Le premier compte qui ouvre un lien devient `owner` automatiquement si `profiles` n’a encore aucun administrateur. Pour forcer une adresse, ajouter dans `.env.local` :

```env
ADMIN_EMAILS=votre@email.com
```

Sinon, lier le profil **par e-mail** (évite un UUID incorrect) :

```sql
insert into public.profiles (id, full_name, role)
select id, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 'owner'
from auth.users
where lower(email) = lower('votre@email.com')
on conflict (id) do update set role = 'owner';
```

Ouvrir `/admin/login`, saisir cet e-mail, puis ouvrir le lien reçu **sur le même navigateur**.

Les comptes absents de `profiles`, ou au rôle `staff`, sont refusés. `SUPABASE_SECRET_KEY` est requise pour créer le profil au premier lien.

## 4. Vérifier

Redémarrer le serveur Next.js après avoir ajouté `.env.local`, puis ouvrir `/admin/database`. L’état doit afficher **Connectée** et les volumes doivent provenir de Supabase.
