import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectVisualSettings } from "../../features/general/settingsSlice";
import { RestoreDefaults } from "./RestoreDefaults";
import { SetColors } from "./SetColors";
import { DateTimeFormat } from "./DateTimeFormat";
import { SetBooleanState } from "./types";
import { CustomizableUnits } from "./CustomizableUnits";

const handleClickOutside =
  (
    setHidden: SetBooleanState,
    setIsOpen: SetBooleanState,
    { current }: React.MutableRefObject<HTMLDivElement | null>
  ) =>
  (event: Event) => {
    // @ts-ignore
    if (current && !current.contains(event.target)) {
      setHidden(true);
      setIsOpen(false);
    }
  };

export const Settings = ({
  settingsContainer,
  hideSettings,
  setHidden,
}: {
  settingsContainer: React.MutableRefObject<HTMLDivElement | null>;
  hideSettings: boolean;
  setHidden: SetBooleanState;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  document.addEventListener(
    "click",
    handleClickOutside(setHidden, setIsOpen, settingsContainer)
  );
  const { bgColor } = useAppSelector(selectVisualSettings);

  return (
    <div
      id="customize-selectors"
      className={hideSettings ? "hidden" : ""}
      style={{ backgroundColor: bgColor }}
    >
      <h1 id="customize-corner-title">Customization</h1>
      <SetColors />
      <RestoreDefaults />
      <DateTimeFormat />
      <hr />
      <CustomizableUnits popover={{ setIsOpen, isOpen }} />
      <div>
        <button
          onClick={() => setHidden(!hideSettings)}
          className="cursor-pointer"
        >
          (Hide)
        </button>
      </div>
    </div>
  );
};
