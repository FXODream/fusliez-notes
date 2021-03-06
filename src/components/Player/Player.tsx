import ColorsMenu from "components/ColorsMenu";
import { IPlayer } from "utils/types";
import React from "react";
import cx from "classnames";
import { useMobile } from "context/MobileContextProvider";
import usePlayerStyles from "./Player.styles";
import { useSettings } from "context/SettingsContextProvider";
import { useTranslation } from "react-i18next";

export interface IPlayerProps {
  color: string;
  playerName: string;
  list: Array<IPlayer>;
  setList: (value: IPlayer[]) => void;
  index: number;
  isReadOnly: boolean;
}

export default function Player(props: IPlayerProps): JSX.Element {
  const { t } = useTranslation();
  const { isMobile, orientation } = useMobile()!; // eslint-disable-line
  const { showNames } = useSettings()!; // eslint-disable-line

  const [isMenuShowing, setIsMenuShowing] = React.useState(false);

  const htmlElRef = React.useRef(null);

  const classes = usePlayerStyles({
    showNames,
    isMobile,
    orientation,
    ...props,
  });

  const { color, playerName, list, setList, index, isReadOnly } = props;

  const handleChange = (
    player: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const players: Array<IPlayer> = [...list];
    players[player].playerName = event.currentTarget.value;
    setList(players);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const currentInput = (htmlElRef.current as unknown) as HTMLInputElement;
      const nextParent =
        currentInput.parentElement?.parentElement?.parentElement
          ?.nextElementSibling ??
        currentInput.parentElement?.parentElement?.parentElement?.parentElement
          ?.firstElementChild;
      const nextInput = nextParent?.lastChild?.lastChild
        ?.firstChild as HTMLInputElement;
      nextInput?.select();
    }
  };

  return (
    <div className={`${classes.Player} player-handle`} id={color}>
      <div className={classes.PlayerTile}>
        {isMenuShowing && !isMobile && !isReadOnly && (
          <ColorsMenu
            isMenuShowing={isMenuShowing}
            setIsMenuShowing={setIsMenuShowing}
            currentColor={color}
          />
        )}
        <div
          className={cx(classes.PlayerIcon, "player-handle")}
          onClick={() => {
            if (isReadOnly) {
              return;
            }

            if (showNames && !isMobile) {
              setIsMenuShowing(!isMenuShowing);
            }
          }}
          style={{
            backgroundImage: `url(assets/images/player-icons/${color}.png)`,
          }}
        ></div>
        {showNames && (
          <div className={classes.PlayerName}>
            {!isReadOnly && (
              <input
                type="text"
                placeholder={t(`main.${color}`)}
                className={classes.PlayerInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, event)
                }
                onKeyPress={handleKeyPress}
                value={playerName}
                ref={htmlElRef}
              />
            )}
            {isReadOnly && (
              <>{playerName !== "" ? playerName : t(`main.${color}`)}</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
