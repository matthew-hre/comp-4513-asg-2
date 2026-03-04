{
  mkShell,
  alejandra,
  bash,
  nodejs,
  bun,
  supabase-cli,
}:
mkShell rec {
  name = "comp-4513-asg-2";

  packages = [
    bash
    nodejs

    # Plays nicer with my system
    bun

    # Required for CI for format checking.
    alejandra

    # Supabase CLI for local dev & migrations
    supabase-cli
  ];
}
