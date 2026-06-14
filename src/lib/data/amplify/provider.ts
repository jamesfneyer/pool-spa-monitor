import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import { configureAmplify, isAmplifyConfigured } from "@/lib/amplify/configure";
import type { DataProvider } from "../provider";
import type {
  CreateChemicalDoseInput,
  CreateEquipmentInput,
  CreateMaintenanceTaskInput,
  CreatePoolNoteInput,
  CreatePoolProfileInput,
  CreateWaterTestInput,
  UpdateChemicalDoseInput,
  UpdateEquipmentInput,
  UpdateMaintenanceTaskInput,
  UpdatePoolNoteInput,
  UpdatePoolProfileInput,
  UpdateWaterTestInput,
} from "../types";
import {
  mapChemicalDose,
  mapEquipment,
  mapMaintenanceTask,
  mapPoolNote,
  mapPoolProfile,
  mapWaterTest,
} from "./mappers";

function getClient() {
  configureAmplify();
  if (!isAmplifyConfigured()) {
    throw new Error(
      "Amplify is not configured. Run `pnpm sandbox` to deploy and generate amplify_outputs.json.",
    );
  }
  return generateClient<Schema>();
}

function throwOnErrors(errors: unknown[] | undefined, context: string) {
  if (errors?.length) {
    throw new Error(`${context}: ${JSON.stringify(errors)}`);
  }
}

export class AmplifyDataProvider implements DataProvider {
  async listPoolProfiles() {
    const client = getClient();
    const { data, errors } = await client.models.PoolProfile.list();
    throwOnErrors(errors, "listPoolProfiles");
    return (data ?? []).map((item) => mapPoolProfile(item as Record<string, unknown>));
  }

  async getPoolProfile(id: string) {
    const client = getClient();
    const { data, errors } = await client.models.PoolProfile.get({ id });
    throwOnErrors(errors, "getPoolProfile");
    return data ? mapPoolProfile(data as Record<string, unknown>) : null;
  }

  async createPoolProfile(input: CreatePoolProfileInput) {
    const client = getClient();
    const { data, errors } = await client.models.PoolProfile.create(input);
    throwOnErrors(errors, "createPoolProfile");
    return mapPoolProfile(data as Record<string, unknown>);
  }

  async updatePoolProfile(id: string, input: UpdatePoolProfileInput) {
    const client = getClient();
    const { data, errors } = await client.models.PoolProfile.update({ id, ...input });
    throwOnErrors(errors, "updatePoolProfile");
    return mapPoolProfile(data as Record<string, unknown>);
  }

  async deletePoolProfile(id: string) {
    const client = getClient();
    const { errors } = await client.models.PoolProfile.delete({ id });
    throwOnErrors(errors, "deletePoolProfile");
  }

  async listWaterTests(poolProfileId?: string) {
    const client = getClient();
    const filter = poolProfileId
      ? { poolProfileId: { eq: poolProfileId } }
      : undefined;
    const { data, errors } = await client.models.WaterTest.list({ filter });
    throwOnErrors(errors, "listWaterTests");
    return (data ?? []).map((item) => mapWaterTest(item as Record<string, unknown>));
  }

  async getWaterTest(id: string) {
    const client = getClient();
    const { data, errors } = await client.models.WaterTest.get({ id });
    throwOnErrors(errors, "getWaterTest");
    return data ? mapWaterTest(data as Record<string, unknown>) : null;
  }

  async createWaterTest(input: CreateWaterTestInput) {
    const client = getClient();
    const { data, errors } = await client.models.WaterTest.create(input);
    throwOnErrors(errors, "createWaterTest");
    return mapWaterTest(data as Record<string, unknown>);
  }

  async updateWaterTest(id: string, input: UpdateWaterTestInput) {
    const client = getClient();
    const { data, errors } = await client.models.WaterTest.update({ id, ...input });
    throwOnErrors(errors, "updateWaterTest");
    return mapWaterTest(data as Record<string, unknown>);
  }

  async deleteWaterTest(id: string) {
    const client = getClient();
    const { errors } = await client.models.WaterTest.delete({ id });
    throwOnErrors(errors, "deleteWaterTest");
  }

  async listChemicalDoses(poolProfileId?: string) {
    const client = getClient();
    const filter = poolProfileId
      ? { poolProfileId: { eq: poolProfileId } }
      : undefined;
    const { data, errors } = await client.models.ChemicalDose.list({ filter });
    throwOnErrors(errors, "listChemicalDoses");
    return (data ?? []).map((item) => mapChemicalDose(item as Record<string, unknown>));
  }

  async getChemicalDose(id: string) {
    const client = getClient();
    const { data, errors } = await client.models.ChemicalDose.get({ id });
    throwOnErrors(errors, "getChemicalDose");
    return data ? mapChemicalDose(data as Record<string, unknown>) : null;
  }

  async createChemicalDose(input: CreateChemicalDoseInput) {
    const client = getClient();
    const { data, errors } = await client.models.ChemicalDose.create(input);
    throwOnErrors(errors, "createChemicalDose");
    return mapChemicalDose(data as Record<string, unknown>);
  }

  async updateChemicalDose(id: string, input: UpdateChemicalDoseInput) {
    const client = getClient();
    const { data, errors } = await client.models.ChemicalDose.update({ id, ...input });
    throwOnErrors(errors, "updateChemicalDose");
    return mapChemicalDose(data as Record<string, unknown>);
  }

  async deleteChemicalDose(id: string) {
    const client = getClient();
    const { errors } = await client.models.ChemicalDose.delete({ id });
    throwOnErrors(errors, "deleteChemicalDose");
  }

  async listEquipment(poolProfileId?: string) {
    const client = getClient();
    const filter = poolProfileId
      ? { poolProfileId: { eq: poolProfileId } }
      : undefined;
    const { data, errors } = await client.models.Equipment.list({ filter });
    throwOnErrors(errors, "listEquipment");
    return (data ?? []).map((item) => mapEquipment(item as Record<string, unknown>));
  }

  async getEquipment(id: string) {
    const client = getClient();
    const { data, errors } = await client.models.Equipment.get({ id });
    throwOnErrors(errors, "getEquipment");
    return data ? mapEquipment(data as Record<string, unknown>) : null;
  }

  async createEquipment(input: CreateEquipmentInput) {
    const client = getClient();
    const { data, errors } = await client.models.Equipment.create(input);
    throwOnErrors(errors, "createEquipment");
    return mapEquipment(data as Record<string, unknown>);
  }

  async updateEquipment(id: string, input: UpdateEquipmentInput) {
    const client = getClient();
    const { data, errors } = await client.models.Equipment.update({ id, ...input });
    throwOnErrors(errors, "updateEquipment");
    return mapEquipment(data as Record<string, unknown>);
  }

  async deleteEquipment(id: string) {
    const client = getClient();
    const { errors } = await client.models.Equipment.delete({ id });
    throwOnErrors(errors, "deleteEquipment");
  }

  async listMaintenanceTasks(poolProfileId?: string) {
    const client = getClient();
    const filter = poolProfileId
      ? { poolProfileId: { eq: poolProfileId } }
      : undefined;
    const { data, errors } = await client.models.MaintenanceTask.list({ filter });
    throwOnErrors(errors, "listMaintenanceTasks");
    return (data ?? []).map((item) =>
      mapMaintenanceTask(item as Record<string, unknown>),
    );
  }

  async getMaintenanceTask(id: string) {
    const client = getClient();
    const { data, errors } = await client.models.MaintenanceTask.get({ id });
    throwOnErrors(errors, "getMaintenanceTask");
    return data ? mapMaintenanceTask(data as Record<string, unknown>) : null;
  }

  async createMaintenanceTask(input: CreateMaintenanceTaskInput) {
    const client = getClient();
    const { data, errors } = await client.models.MaintenanceTask.create(input);
    throwOnErrors(errors, "createMaintenanceTask");
    return mapMaintenanceTask(data as Record<string, unknown>);
  }

  async updateMaintenanceTask(id: string, input: UpdateMaintenanceTaskInput) {
    const client = getClient();
    const { data, errors } = await client.models.MaintenanceTask.update({
      id,
      ...input,
    });
    throwOnErrors(errors, "updateMaintenanceTask");
    return mapMaintenanceTask(data as Record<string, unknown>);
  }

  async deleteMaintenanceTask(id: string) {
    const client = getClient();
    const { errors } = await client.models.MaintenanceTask.delete({ id });
    throwOnErrors(errors, "deleteMaintenanceTask");
  }

  async listPoolNotes(poolProfileId?: string) {
    const client = getClient();
    const filter = poolProfileId
      ? { poolProfileId: { eq: poolProfileId } }
      : undefined;
    const { data, errors } = await client.models.PoolNote.list({ filter });
    throwOnErrors(errors, "listPoolNotes");
    return (data ?? []).map((item) => mapPoolNote(item as Record<string, unknown>));
  }

  async getPoolNote(id: string) {
    const client = getClient();
    const { data, errors } = await client.models.PoolNote.get({ id });
    throwOnErrors(errors, "getPoolNote");
    return data ? mapPoolNote(data as Record<string, unknown>) : null;
  }

  async createPoolNote(input: CreatePoolNoteInput) {
    const client = getClient();
    const { data, errors } = await client.models.PoolNote.create(input);
    throwOnErrors(errors, "createPoolNote");
    return mapPoolNote(data as Record<string, unknown>);
  }

  async updatePoolNote(id: string, input: UpdatePoolNoteInput) {
    const client = getClient();
    const { data, errors } = await client.models.PoolNote.update({ id, ...input });
    throwOnErrors(errors, "updatePoolNote");
    return mapPoolNote(data as Record<string, unknown>);
  }

  async deletePoolNote(id: string) {
    const client = getClient();
    const { errors } = await client.models.PoolNote.delete({ id });
    throwOnErrors(errors, "deletePoolNote");
  }
}
