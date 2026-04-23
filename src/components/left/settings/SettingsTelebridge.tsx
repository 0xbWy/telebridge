import { memo } from '../../../lib/teact/teact';

import useLang from '../../../hooks/useLang';
import useLastCallback from '../../../hooks/useLastCallback';

import ListItem from '../../ui/ListItem';

import styles from './SettingsTelebridge.module.scss';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

const SECTIONS = [
  { key: 'Identity', icon: 'key' },
  { key: 'Password', icon: 'lock' },
  { key: 'Contacts', icon: 'user' },
  { key: 'Chats', icon: 'message' },
  { key: 'Security', icon: 'permissions' },
  { key: 'About', icon: 'info' },
] as const;

const SettingsTelebridge = ({ isActive, onReset }: OwnProps) => {
  const lang = useLang();

  const handleSectionClick = useLastCallback((_key: string) => {
    // Sections are stubs for now; navigation will be implemented in future milestones
  });

  return (
    <div className="settings-content custom-scroll">
      <div className={styles.heading}>
        <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsTitle')}</h3>
        <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsSubtitle')}</p>
      </div>

      <div className="settings-main-menu">
        {SECTIONS.map(({ key, icon }) => (
          <ListItem
            key={key}
            icon={icon}
            narrow
            onClick={() => handleSectionClick(key)}
          >
            {lang(`TeleBridgeSettings${key}`)}
          </ListItem>
        ))}
      </div>
    </div>
  );
};

export default memo(SettingsTelebridge);
