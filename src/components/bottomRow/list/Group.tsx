import {
  ItemList,
  StartEndUnitType,
  ListKey,
} from "../../../features/itemList/types";
import { DragAndDrop } from "./item/DumbListItem";
import { List } from "./List";
import { ElapsedTime } from "../../atoms/ElapsedTime";

interface ListGroupProps {
  title: string;
  list: ItemList;
  dragAndDrop?: DragAndDrop;
  listKey: ListKey;
  term?: StartEndUnitType;
  setTerm: React.Dispatch<React.SetStateAction<StartEndUnitType>>;
  advanceTerm: (...props: any) => void;
  isScopedToWorkingHours?: boolean;
}

export const ListGroup = ({
  title,
  term,
  setTerm,
  list,
  dragAndDrop,
  listKey,
  advanceTerm,
  isScopedToWorkingHours,
}: ListGroupProps) => {
  return (
    <div className="priorities">
      <div className="priorities-title">
        <span>{title}</span>
        <ElapsedTime
          term={term}
          setTerm={setTerm}
          advanceTerm={advanceTerm}
          isScopedToWorkingHours={isScopedToWorkingHours}
        />
      </div>
      <List itemList={list} listKey={listKey} dragAndDrop={dragAndDrop} />
    </div>
  );
};
