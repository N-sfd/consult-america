/**
 * Curated stock-photo manifest. Each key maps to exactly one Unsplash photo id
 * so components import a named usage context instead of hardcoding raw URLs —
 * that's what previously let the same photo silently end up on 3-5 unrelated
 * pages. Add new keys here rather than inlining a new `images.unsplash.com` URL.
 */
const stockImageIds = {
  hero: "1522071820081-009f0129c71c",
  heroTexture: "1486406146926-c627a92ad1ab",
  heroArchitectural: "1486406146926-c627a92ad1ab",
  heroDetail: "1551288049-bebda4e38f71",
  aiDataStory: "1551288049-bebda4e38f71",
  capabilitiesTransform: "1454165804606-c3d57bc86b40",
  capabilitiesModernize: "1518770660439-4636190af475",
  capabilitiesIntelligence: "1573164713988-8665fc963095",
  capabilitiesBuild: "1552664730-d307ca884978",
  capabilitiesOperate: "1600880292203-757bb62b4baf",
  careersHero: "1543269865-cbf427effbad",
  careersPreview: "1517245386807-bb43f82c33c4",
  crmShowcase: "1573496359142-b8d87734a5a2",
  enterpriseTransformationFeature: "1542744173-8e7e53415bb0",
  industriesSectionGovernment: "1541872703-74c5e44368f9",
  industriesSectionHealthcare: "1519494026892-80bbd2d6fd0d",
  industriesSectionFinancial: "1522202176988-66273c2fd55f",
  industriesSectionTech: "1556761175-5973dc0f32e7",
  industriesGovernment: "1555848962-6e79363ec58f",
  industriesFinancial: "1611974789855-9c2a0a7236a3",
  industriesHealthcare: "1576091160399-112ba8d25d1d",
  industriesTech: "1518432031352-d6fc5c10da5a",
  insightsHero: "1552581234-26160f608093",
  insightsCard1: "1504384308090-c894fdcc538d",
  insightsCard2: "1521791136064-7986c2920216",
  insightsCard3: "1497366216548-37526070297c",
  introduction: "1556742049-0cfed4f6a45d",
  oracleFlagship: "1542626991-cbc4e32524cc",
  oracleEnterprisePlanning: "1454165804606-c3d57bc86b40",
  oracleFinanceOps: "1517048676732-d65bc937f952",
  oracleSupplyChain: "1600880292203-757bb62b4baf",
  oracleWorkflowDetail: "1611974789855-9c2a0a7236a3",
  healthcareClinical: "1541746972996-4e0b0f43e02a",
  technologyEngineering: "1556157382-97eda2d62296",
  selectedWorkHero: "1531973576160-7125cd663d86",
  selectedWorkProject1: "1451187580459-43490279c0fa",
  selectedWorkProject2: "1560250097-0b93528c311a",
  whatWeDoTransform: "1560472354-b33ff0c44a43",
  whatWeDoModernize: "1556155092-490a1ba16284",
  whatWeDoIntelligence: "1554774853-b415df9eeb92",
  whatWeDoBuild: "1531482615713-2afd69097998",
  relatedInsights1: "1461749280684-dccba630e2f6",
  relatedInsights2: "1497215728101-856f4ea42174",
  relatedInsights3: "1460925895917-afdab827c52f",
  caseStudyOracle: "1517048676732-d65bc937f952",
  caseStudyAiDocument: "1568992687947-868a62a9f521",
  caseStudyPublicSector: "1553877522-43269d4ea984",
  capabilityPageEnterpriseTransformation: "1557804506-669a67965ba0",
  capabilityPageDigitalEngineering: "1556157382-97eda2d62296",
  capabilityPageManagedDelivery: "1512428813834-c702c7702b78",
  industryPageGovernment: "1590650046871-92c887180603",
  industryPageFinancial: "1524178232363-1fb2b075b655",
  industryPageHealthcare: "1541746972996-4e0b0f43e02a",
  industryPageTechnology: "1450101499163-c8848c66ca85",
  productCard1: "1522542550221-31fd19575a2d",
  productCard2: "1519085360753-af0119f7cbe7",
  productCard3: "1573167243872-43c6433b9d40",
  careersPageHero: "1521737604893-d14cc237f11d",
  jobApplyHero: "1573497019940-1c28c88b4f3e",
  industryPageRetail: "1441986300917-64674bd600d8",
  industryPageTransportation: "1494412651409-8963ce7935a7",
} as const;

export type StockImageKey = keyof typeof stockImageIds;

export function stockImage(
  key: StockImageKey,
  params: { w: number; q?: number; fit?: "crop" | "clip" | "fill" | "max" | "scale" } = { w: 1200 }
) {
  const { w, q = 80, fit = "crop" } = params;
  return `https://images.unsplash.com/photo-${stockImageIds[key]}?auto=format&fit=${fit}&w=${w}&q=${q}`;
}
