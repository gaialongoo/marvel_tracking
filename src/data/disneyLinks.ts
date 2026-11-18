/* ============================================================================
   PAGINE UFFICIALI DISNEY+ ITALIA dei titoli (lette il 18/11/2026)
   id del catalogo → codice della pagina disneyplus.com/it-it/browse/entity-<codice>
   Il pulsante "Pagina ufficiale" della scheda apre questo indirizzo.
   Per le serie divise in stagioni, ogni stagione punta alla pagina della serie.
   ============================================================================ */
const E: Record<string, string> = {
  // ----- MCU: film -----
  im: "0c520152-b81f-4c20-9310-003debd1947e", im2: "85c5529d-c053-4fa4-9957-4906eb5aedc6",
  thor: "479d41e3-8438-4ba4-b93d-8223220e069c", ca: "8e68c43a-117c-4f4d-b217-0db106a1a614",
  avg: "d2ab699b-67da-4906-a7a4-5bc542c953cf", im3: "e8569c2d-85ec-42a4-8811-b2618d494a40",
  tdw: "7c4f4e28-4152-4f64-90ec-8b7f682c33d4", tws: "ef333a5c-b855-4d3e-a7d9-d9e142b6dc7d",
  gotg: "c9ee959b-7249-4a4c-9708-9ffd1ddb00f1", aou: "42329b99-0953-4f1a-9420-a0dbf7733e95",
  antman: "af42798c-b9db-457f-b748-5e1f029c1ece", cw: "2bd19267-1387-4b51-98e6-5189ff28e9c9",
  ds: "43a741e8-2369-4577-9bec-ef94f4aaae0b", gotg2: "9fcd7087-c151-49dc-aeb9-b2f9943fd4e6",
  homecoming: "d285316b-e1ea-4b50-933a-bb5fd13549c1", ragnarok: "766280de-0c00-4781-a388-2c85c5b4e259",
  bp: "8904b1b5-da2c-4ff1-b389-dc81825559fd", iw: "9a136e06-852a-41bf-b71d-fa061cb43225",
  amw: "3533ca7b-e187-4bf5-a65c-7c903cd2d4ad", cm: "1e383a14-1ea6-4345-9ab8-fd37618669af",
  eg: "b39aa962-be56-4b09-a536-98617031717f", ffh: "6e497c43-d4da-4e12-b100-d4d38dc2a7ff",
  bw: "d9cd6bd1-bcf8-4a3b-8f92-0fdd4f79ac08", shangchi: "92243dd0-bcfe-4365-ae76-1fa3cf1a2ab9",
  eternals: "b042efa2-6650-48fd-bf35-ea285a5a5649", nwh: "295fb45a-c8bb-477e-816f-b0706b4d9984",
  dsmom: "6fe6062c-2499-4f44-a48a-fc93f59cb504", lat: "0007d7a0-2515-411e-9294-2de6a7b8d00e",
  wf: "86e14fdb-3841-4282-ad38-07c8c4aab4b6", quantumania: "eb1453f3-48aa-4af0-85f5-8ca4916c7415",
  gotg3: "820f0ded-3254-42c5-a7e4-7c044ff6dd65", marvels: "75c90eca-8969-4edb-ac1a-7165cff2671c",
  dpw: "120ae1e6-2240-4924-a4ce-f8de6e28b0b1", bnw: "3064ac7f-ef4d-4f89-b92f-b5524da92a72",
  thunderbolts: "f51dce23-7d8f-490a-9f0c-be1b5432c2a9", ff: "2142a7a9-4c49-438d-a492-296c4e08b714",
  // ----- MCU: corti e speciali -----
  "os-consultant": "cad91b86-ab50-4fce-882f-ae71c86c2938", "os-item47": "2cd46937-17fe-4ada-8de4-0972f2763f1c",
  "os-carter": "5e7f5aa1-b3ea-4cd3-983f-c5cda970fb0a", "os-king": "14988369-345c-4984-9c16-59428bd70609",
  "os-hammer": "b45838e2-aa7a-4985-923d-9fe949e40ece", wbn: "ad2fd4e8-062b-45b9-b2c5-8b8779873e48",
  holiday: "1a15fe60-3236-4242-a699-a4e3392cf112", punolk: "c5b69f75-f159-4749-873d-9a1d1a4eb878",
  // ----- MCU: serie (ogni stagione → pagina della serie) -----
  wv: "90affd1f-0851-48bc-9cab-c142d5c9c20c", fatws: "3c08a31a-2350-4aaf-90d0-88def4c551bf",
  loki1: "8f8c5cbb-e5ba-4285-9e2c-86abcac9fd50", loki2: "8f8c5cbb-e5ba-4285-9e2c-86abcac9fd50",
  whatif1: "fc588cfe-ff2b-4a44-abbd-d76359ce778f", whatif2: "fc588cfe-ff2b-4a44-abbd-d76359ce778f", whatif3: "fc588cfe-ff2b-4a44-abbd-d76359ce778f",
  hawkeye: "128482e8-a9bc-4289-9c0d-83a975d823f3", moonknight: "330062c7-20c5-45e1-b6c5-e1e096055d75",
  msmarvel: "7bf8d7e6-9739-4fee-86c0-f4afc48b152c", shehulk: "b1c3c897-b925-4236-88e4-1ceed3623a46",
  groot1: "38f451b9-22df-4784-b580-4e4db4b92dba", groot2: "38f451b9-22df-4784-b580-4e4db4b92dba",
  si: "4cfe6313-7f5e-4544-af84-d31bf718f65a", echo: "3c9aa47d-88c2-455b-a63b-4be76b666a55",
  agatha: "5e474669-a4a2-4b90-a928-5ae7f845090c", ironheart: "b2b50b9a-a055-4b31-a609-8ec46f3add98",
  ddba1: "85e7a914-c8e6-41db-95df-c740dc2cf1b7", ddba2: "85e7a914-c8e6-41db-95df-c740dc2cf1b7",
  eow: "8d16eb3d-b7e5-4c43-abda-a281be4d284a", zombies: "d274138a-7c29-4ddf-9ea2-2f9d3c1a24a0",
  visionquest: "8744ec55-8d14-4631-99b4-c889a2d6013f",
  dd1: "b03f0bdc-ebd5-44df-a16a-1a180a88873a", dd2: "b03f0bdc-ebd5-44df-a16a-1a180a88873a", dd3: "b03f0bdc-ebd5-44df-a16a-1a180a88873a",
  jj1: "6e31f304-024a-41a2-97a5-5a7ced0345a8", jj2: "6e31f304-024a-41a2-97a5-5a7ced0345a8", jj3: "6e31f304-024a-41a2-97a5-5a7ced0345a8",
  lc1: "0e8ba0c3-47da-44d4-bab5-1c6f5d6e61a0", lc2: "0e8ba0c3-47da-44d4-bab5-1c6f5d6e61a0",
  if1: "d251acf8-4a1a-48d1-b3b7-d9513afeaac0", if2: "d251acf8-4a1a-48d1-b3b7-d9513afeaac0",
  defenders: "61687bed-4a66-4657-9252-df80ca1d1fbc",
  pun1: "bbe154ae-af21-49dd-8129-90077e61c991", pun2: "bbe154ae-af21-49dd-8129-90077e61c991",
  // ----- Fuori MCU: film -----
  xmen: "e9f59c82-de76-4a18-a849-192532ff9b2d", x2: "54748282-5bf7-496c-8db9-a9aa3b7f57ac",
  x3: "e0f6bbed-cea5-41c1-b787-478f21255898", xow: "82480f3f-6f11-4feb-8c4e-b32c0aca2c53",
  xfc: "9f9e9ae3-88d8-467b-8969-28d253cc4687", wolv13: "0f3b4bfe-aa16-43f2-8a11-d5586c6e6c8f",
  dofp: "5b3d1005-eb3b-41bb-8ac6-a025263d8106", deadpool: "17854bdb-0121-4327-80a0-699fdecd1aaa",
  apocalypse: "3ea207ed-b92e-4e71-9ce6-5c0d8afd4265", logan: "7c1743ec-7cd6-4da4-9e8c-b713ad4e634a",
  deadpool2: "27e84e56-31d3-4813-91ba-602cb52890f1", darkphoenix: "180356b5-0596-4333-891f-e48c526a0803",
  ff2005: "d6592baa-0dc6-4549-a0cb-3b93a3b0e260", ff2007: "06810fd3-a12e-4185-829b-36b3c814ce97",
  fant4stic: "f7f1d27d-6d5a-479d-8a06-fa53689bf61c", tasm: "f43ffe63-2c96-4b6c-8fae-84d0d22d6466",
  tasm2: "c21c733a-18f4-4cdc-b1e8-1ff6b996c0a3", spiderverse: "e4cd7619-7c84-4b4d-acf0-f53ca1b442a3",
  // ----- Fuori MCU: serie e animazione -----
  aos: "63516dff-91f8-4deb-b110-d22552f329cb", agentcarter: "e4cbebda-a890-4e99-9a29-40d2162f7d46",
  inhumans: "f93e8212-c6c0-4a2f-a147-ad220f3481c8", xmen92: "8eaac297-16fe-4d83-bb0f-ca0a280b8b82",
  xmen97: "8dc91ed4-cdca-4fab-9723-d3d42f382d34", sm2017: "9a45dce7-ab64-4da8-8089-47a87d5db9ec",
  smshorts: "133d6369-075f-44ab-ae24-d4781a291d3b", fnsm: "b1417e49-48ad-4827-bfd6-94580ecbecd7",
  hulkwmd: "f5c6aedb-e73c-40f1-af7b-b598252cfe76", jeff: "6a8ccf9a-c6e1-497b-b82a-651c0e6e8467",
  usm: "a2e424b4-ad77-4733-9f74-fd11222339a8", assemble: "07eb26b1-fdd6-4147-a149-f0d69a1fc4e2",
  smash: "8bdb64a0-4ca5-4092-ad51-362157105bfb", gotg15: "f68d4e4b-281a-42ae-be09-e1715396c4ae",
  emh: "10324f91-223b-4d68-a1b5-168eada6e574", futureavengers: "b311d339-1082-4195-ac3d-e53e3478c5c5",
  imhulk: "7b008081-e2d7-43fa-b550-87d1bacab04b", imcap: "591a6d39-3ab5-4e56-92b9-2a8ea9ed2344",
};

/** Indirizzo della pagina ufficiale Disney+ Italia (undefined se non è su Disney+) */
export const disneyUrl = (id: string): string | undefined =>
  E[id] ? `https://www.disneyplus.com/it-it/browse/entity-${E[id]}` : undefined;
