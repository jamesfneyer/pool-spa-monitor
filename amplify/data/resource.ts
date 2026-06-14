import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  PoolProfile: a
    .model({
      name: a.string().required(),
      type: a.enum(["pool", "spa"]),
      gallons: a.float().required(),
      surfaceType: a.string(),
      sanitizerType: a.string(),
      targetFreeChlorineMin: a.float(),
      targetFreeChlorineMax: a.float(),
      targetPHMin: a.float(),
      targetPHMax: a.float(),
      targetAlkalinityMin: a.float(),
      targetAlkalinityMax: a.float(),
      targetCyaMin: a.float(),
      targetCyaMax: a.float(),
      targetSaltMin: a.float(),
      targetSaltMax: a.float(),
      waterTests: a.hasMany("WaterTest", "poolProfileId"),
      chemicalDoses: a.hasMany("ChemicalDose", "poolProfileId"),
      equipment: a.hasMany("Equipment", "poolProfileId"),
      maintenanceTasks: a.hasMany("MaintenanceTask", "poolProfileId"),
      poolNotes: a.hasMany("PoolNote", "poolProfileId"),
    })
    .authorization((allow) => [allow.owner()]),

  WaterTest: a
    .model({
      poolProfileId: a.id().required(),
      poolProfile: a.belongsTo("PoolProfile", "poolProfileId"),
      testedAt: a.datetime().required(),
      freeChlorine: a.float(),
      totalChlorine: a.float(),
      pH: a.float(),
      alkalinity: a.float(),
      calciumHardness: a.float(),
      cya: a.float(),
      salt: a.float(),
      phosphates: a.float(),
      waterTemp: a.float(),
      notes: a.string(),
      chemicalDoses: a.hasMany("ChemicalDose", "waterTestId"),
    })
    .authorization((allow) => [allow.owner()]),

  ChemicalDose: a
    .model({
      poolProfileId: a.id().required(),
      poolProfile: a.belongsTo("PoolProfile", "poolProfileId"),
      waterTestId: a.id(),
      waterTest: a.belongsTo("WaterTest", "waterTestId"),
      chemicalType: a.enum([
        "liquid_chlorine",
        "muriatic_acid",
        "baking_soda",
        "calcium_chloride",
        "cyanuric_acid",
        "salt",
        "phosphate_remover",
        "clarifier",
        "shock",
        "other",
      ]),
      amount: a.float().required(),
      unit: a.string().required(),
      reason: a.string(),
      addedAt: a.datetime().required(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Equipment: a
    .model({
      poolProfileId: a.id().required(),
      poolProfile: a.belongsTo("PoolProfile", "poolProfileId"),
      name: a.string().required(),
      category: a.enum([
        "pump",
        "filter",
        "heater",
        "salt_cell",
        "robot_cleaner",
        "automation",
        "spa",
        "other",
      ]),
      manufacturer: a.string(),
      model: a.string(),
      serialNumber: a.string(),
      installedAt: a.datetime(),
      warrantyExpiresAt: a.datetime(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  MaintenanceTask: a
    .model({
      poolProfileId: a.id().required(),
      poolProfile: a.belongsTo("PoolProfile", "poolProfileId"),
      title: a.string().required(),
      category: a.string(),
      status: a.enum(["pending", "complete", "skipped"]),
      dueDate: a.datetime().required(),
      completedAt: a.datetime(),
      recurrence: a.string(),
      notes: a.string(),
      recommendationGroupId: a.string(),
      sourceTipId: a.string(),
      sequenceOrder: a.integer(),
      delayAfterPreviousMinutes: a.integer(),
    })
    .authorization((allow) => [allow.owner()]),

  PoolNote: a
    .model({
      poolProfileId: a.id().required(),
      poolProfile: a.belongsTo("PoolProfile", "poolProfileId"),
      title: a.string().required(),
      body: a.string().required(),
      category: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
