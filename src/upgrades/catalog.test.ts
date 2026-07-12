import { describe, expect, it } from "vitest";
import { upgradeById, upgradeCatalogue, upgradeTreeIds, upgradeTrees } from "./catalog";

describe("structured upgrade catalogue", () => {
  it("ships ten four-node trees and ten cross-tree fusions", () => {
    expect(upgradeTreeIds).toHaveLength(10);
    expect(upgradeTrees).toHaveLength(10);
    for (const tree of upgradeTrees) {
      expect(tree.nodes, tree.id).toHaveLength(4);
      expect(tree.nodes.filter(({ tier }) => tier === "root"), tree.id).toHaveLength(1);
      expect(tree.nodes.filter(({ tier }) => tier === "branch"), tree.id).toHaveLength(2);
      expect(tree.nodes.filter(({ tier }) => tier === "capstone"), tree.id).toHaveLength(1);
    }
    expect(upgradeCatalogue.filter(({ tier }) => tier === "fusion")).toHaveLength(10);
  });

  it("makes every prerequisite resolvable and keeps the graph acyclic", () => {
    const visit = (id: string, stack = new Set<string>()) => {
      expect(stack.has(id), `cycle at ${id}`).toBe(false);
      const spec = upgradeById.get(id);
      expect(spec, `${id} resolves`).toBeDefined();
      const next = new Set(stack).add(id);
      for (const requirement of spec?.requires ?? []) visit(requirement, next);
    };
    for (const upgrade of upgradeCatalogue) visit(upgrade.id);
  });

  it("locks branches behind roots, capstones behind both branches, and fusions behind two capstones", () => {
    for (const tree of upgradeTrees) {
      const root = tree.nodes.find(({ tier }) => tier === "root")!;
      const branches = tree.nodes.filter(({ tier }) => tier === "branch");
      const capstone = tree.nodes.find(({ tier }) => tier === "capstone")!;
      expect(branches.every(({ requires }) => requires.includes(root.id)), tree.id).toBe(true);
      expect(new Set(capstone.requires), tree.id).toEqual(new Set(branches.map(({ id }) => id)));
    }
    for (const fusion of upgradeCatalogue.filter(({ tier }) => tier === "fusion")) {
      expect(fusion.requires).toHaveLength(2);
      expect(fusion.requires.every((id) => upgradeById.get(id)?.tier === "capstone"), fusion.id).toBe(true);
    }
  });

  it("gives every node behavioral tags for runtime routing", () => {
    expect(upgradeCatalogue.every(({ tags }) => tags.length > 0)).toBe(true);
  });

  it("contains explicit, synergistic core-stat upgrades", () => {
    const tags = new Set(upgradeCatalogue.flatMap((upgrade) => upgrade.tags));
    for (const tag of ["movement", "size", "fireRate", "reloadSpeed", "ammo", "summonDamage", "summonAttackSpeed"]) {
      expect(tags.has(tag), tag).toBe(true);
    }
    expect(upgradeById.get("brood_cascade")?.requires).toEqual(["larval_split", "host_jump"]);
  });
});
