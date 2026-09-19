import SlashMenu from "./SlashMenu";
import BlockHandleMenu from "./BlockHandleMenu";
import SidebarTree from "./SidebarTree";
import TableCompare from "./TableCompare";
import PropertyTypes from "./PropertyTypes";
import ViewMenu from "./ViewMenu";
import SharePermissions from "./SharePermissions";
import RollupTable from "./RollupTable";

/**
 * 레벨 데이터가 화면을 고를 때 쓰는 이름표입니다.
 * 데이터에는 이름만 적고, 실제 그리는 일은 여기서 연결합니다.
 */
export const SCREENS = {
  slashMenu: SlashMenu,
  blockHandle: BlockHandleMenu,
  sidebarTree: SidebarTree,
  tableCompare: TableCompare,
  propertyTypes: PropertyTypes,
  viewMenu: ViewMenu,
  sharePermissions: SharePermissions,
  rollupTable: RollupTable,
} as const;

export type ScreenKey = keyof typeof SCREENS;
