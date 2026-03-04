{
  mkShell,
  alejandra,
  bash,
  nodejs,
  bun,
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
  ];
}
