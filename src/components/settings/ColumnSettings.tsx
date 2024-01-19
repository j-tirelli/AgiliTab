import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  defaultShortTerm,
  defaultMediumTerm,
  defaultLongTerm,
  selectTerm,
  selectVisualSettings,
} from "../../features/settings/settingsSlice";
import { SetBooleanState } from "./term/WorkDay";
import { OnSaveProps, saveTerm } from "../../features/settings/utils";
import { DateTime } from "luxon";
import Icon from "../atoms/Icon";
import { UnitType } from "../../features/settings/types";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { TermName } from "./term/TermName";
import RadioButton from "../atoms/RadioButton";
import { SelectDate } from "./term/SelectDate";
import { Duration } from "./term/Duration";
import { handleClickOutside } from "../../features/utils/handleClickOutside";
import { DATE_TIME_NO_SECONDS } from "../../commonUtils";

const defaultTerms: Record<number, UnitType> = {
  0: defaultShortTerm,
  1: defaultMediumTerm,
  2: defaultLongTerm,
};

export const ColumnSettings = ({
  settingsContainer,
  hideSettings,
  setHideSettings,
  groupId,
}: {
  settingsContainer: React.MutableRefObject<HTMLDivElement | null>;
  hideSettings: boolean;
  setHideSettings: SetBooleanState;
  groupId: number;
}) => {
  useEffect(() => {
    const clickHandler = handleClickOutside(
      setHideSettings,
      settingsContainer,
      true
    );
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run on mount only
  }, []);

  const { bgColor } = useAppSelector(selectVisualSettings);
  const termData = useAppSelector(selectTerm(groupId));

  const { secondFontColor } = useAppSelector(selectVisualSettings);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [unitType, setUnitType] = useState("");
  const [isDuration, setIsDuration] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(termData.duration);
  const [repeat, setRepeat] = useState(true);

  useEffect(() => {
    setUnitType(termData.title.toLowerCase());
    setTitle(termData.title);
    setStartDate(termData.startDate ?? "");
    setEndDate(
      termData?.endDate ??
        DateTime.fromISO(termData.startDate ?? "")
          .plus({ [termData.duration.unit]: termData.duration.qty })
          .toFormat(DATE_TIME_NO_SECONDS) ??
        ""
    );
    setRepeat(termData.repeat);
  }, [termData]);

  // const checkboxId = `${category}_repeat-duration`;

  const onChange = (changed: Partial<OnSaveProps>) => {
    if (duration.qty) {
      saveTerm({
        enabled: true,
        isDuration,
        duration,
        startDate,
        dispatch,
        groupId,
        unitType,
        title,
        repeat,
        endDate,
        ...changed,
      });
    }
  };

  return (
    <div
      className={`p-2 overflow-auto xl:w-[25vw] text-xs leading-normal border border-current shadow-2xl${
        hideSettings ? " hidden" : ""
      }`}
      data-testid="hideable-settings"
      style={{ backgroundColor: bgColor }}
    >
      <h1 className="text-xl" id="settings-title">
        <div className="inline-block ml-2">
          <RadioButton
            enabled={true}
            groupId={groupId}
            firstRadioName="duration"
            secondRadioName="date"
            firstIsChecked={isDuration}
            setIsChecked={setIsDuration}
          />
        </div>
        <Icon
          onClick={() => {
            const startDate = defaultTerms[groupId].startDate ?? "";
            const endDate = defaultTerms[groupId].endDate ?? "";
            const unitType = defaultTerms[groupId].unitType;
            const title = defaultTerms[groupId].title;
            const repeat = defaultTerms[groupId].repeat;
            const duration = defaultTerms[groupId].duration;
            setStartDate(startDate);
            setEndDate(endDate);
            setUnitType(unitType);
            setTitle(title);
            setRepeat(repeat);
            setDuration(duration);
            onChange({ startDate, endDate, unitType, title, repeat, duration });
          }}
          data-testid={`group-${groupId}-restore-defaults`}
          icon={faArrowRightFromBracket}
          title="Restore Defaults"
          iconClassName="float-right mr-2"
          faStyle={{ color: secondFontColor }}
        />
      </h1>
      <hr style={{ borderColor: "inherit" }} />
      <div className="my-2 w-fit flex flex-wrap mx-auto">
        <div className="mb-1 inline-block ml-2 min-w-[10.5rem]">
          <TermName
            groupId={groupId}
            title={title}
            enabled={true}
            setTitle={setTitle}
            setUnitType={setUnitType}
            onChange={onChange}
          />
        </div>
        <div className="inline-block mb-1 inline-block min-w-[10.5rem] ml-2">
          <SelectDate
            title="Beginning"
            groupId={groupId}
            date={startDate}
            limit={{ max: endDate }}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onChange={onChange}
          />
        </div>
        <div className="inline-block mb-1 inline-block min-w-[10.5rem] ml-2">
          {!isDuration && (
            <SelectDate
              title="End"
              groupId={groupId}
              date={endDate}
              limit={{ min: startDate }}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onChange={onChange}
            />
          )}
          {isDuration && (
            <Duration
              duration={duration}
              groupId={groupId}
              enabled={true}
              setDuration={setDuration}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
