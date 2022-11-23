import { FC, useState } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';
import { TextInput } from '@frakt/components/TextInput';
import styles from '../NotificationsSider.module.scss';

export const SetUpContent: FC = () => {
  const [telegram, setTelegram] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log({
      telegram,
      email,
      phone,
    });
  };

  return (
    <div className={classNames(styles.content, styles.contentSetUp)}>
      <TextInput
        label="Telegram username"
        onChange={setTelegram}
        placeholder="@degenuser"
      />
      <TextInput
        label="Email address"
        onChange={setEmail}
        placeholder="degenuser@frakt.xyz"
      />
      <TextInput
        label="Phone number"
        onChange={setPhone}
        placeholder="+00 000 000 000"
      />

      <Button type="secondary" onClick={onSubmit}>
        Save
      </Button>
    </div>
  );
};
