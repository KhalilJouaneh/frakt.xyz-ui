import { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { web3 } from 'fbonds-core';
import classNames from 'classnames/bind';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import OrderBook from '../MarketPage/components/OrderBook/OrderBook';
import Button from '../../components/Button';
import { LoadingModal } from '@frakt/components/LoadingModal';
import Tooltip from '@frakt/components/Tooltip';
import SizeField from './components/SizeField/SizeField';
import RadioButton from './components/RadioButton/RadioButton';
import { SliderGradient } from './components/SliderGradient/SliderGradient';
import { Header } from './components/Header';

import { usePoolCreation } from './hooks/usePoolCreation';
import { SOL_TOKEN } from '../../utils';
import { formatNumber } from '@frakt/utils/solanaUtils';
import { useNativeAccount } from '@frakt/utils/accounts';
import { useMarket } from '@frakt/utils/bonds';
import { Solana } from '@frakt/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './PoolsCreationPage.module.scss';

const PoolsCreationPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const history = useHistory();
  const { account } = useNativeAccount();
  const { market, isLoading } = useMarket({
    marketPubkey,
  });

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const handleCheckbox = () => setIsChecked((prev) => !prev);

  const {
    loadingModalVisible,
    closeLoadingModal,
    maxLTV,
    duration,
    solDeposit,
    solFee,
    handleMaxLTV,
    handleDuration,
    handleSolDeposit,
    handleSolFee,
    onSubmit,
    isValid,
  } = usePoolCreation();

  const goBack = () => {
    history.goBack();
  };

  const valueStr = +formatNumber.format(
    (account?.lamports || 0) / web3.LAMPORTS_PER_SOL,
  );

  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header
          className={styles.headerWrapper}
          title="Offer parameters"
          onBackBtnClick={goBack}
        />

        <div className={styles.block}>
          <div className={styles.floorWrapper}>
            <div className={styles.floorCard}>
              <h6 className={styles.floorCardTitle}>collection</h6>

              <div className={styles.cardCollection}>
                <img
                  className={styles.collectionImage}
                  src={market?.collectionImage}
                  alt={market?.collectionName}
                />
                <span className={styles.floorCardValue}>
                  {!isLoading ? market?.collectionName : '--'}
                </span>
              </div>
            </div>
            <div className={styles.floorCard}>
              <h6 className={styles.floorCardTitle}>floor</h6>
              <span
                className={classNames(styles.floorCardValue, styles.florPrice)}
              >
                {!isLoading ? 235 + ' sol' : '--'}
              </span>
            </div>
          </div>
          <h5 className={styles.blockTitle}>Loan parameters</h5>
          <SliderGradient value={maxLTV} setValue={handleMaxLTV} />

          <div className={styles.duration}>
            <h6 className={styles.subtitle}>duration</h6>
            <RadioButton
              duration={duration}
              handleDuration={handleDuration}
              buttons={[{ value: '7' }, { value: '14' }]}
            />
          </div>

          <TokenField
            value={solFee}
            onValueChange={handleSolFee}
            label="INTEREST"
            currentToken={SOL_TOKEN}
            tokensList={[SOL_TOKEN]}
            toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
          />
          <SizeField
            value={solDeposit}
            onValueChange={handleSolDeposit}
            label="SIZE"
            currentToken={SOL_TOKEN}
            lpBalance={valueStr}
            toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
          />

          <div className={styles.checkbox}>
            <label className={styles.checkboxLabel}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                name="checkbox"
                checked={isChecked}
                onChange={handleCheckbox}
              />
              Receive liquidated NFTs
            </label>
            <Tooltip
              placement="bottom"
              overlay="Analyzed profit from repaying the loan"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>

          <div className={styles.total}>
            <h5 className={styles.blockTitle}>Your total is 232.5 SOL</h5>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>you can fund</span>
              </div>
              <div className={styles.totalValue}>5 Loans</div>
            </div>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>apy</span>
                <Tooltip
                  placement="bottom"
                  overlay="Analyzed profit from repaying the loan"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </div>
              <div className={styles.totalValue}>123.11 %</div>
            </div>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>estimated profit</span>
                <Tooltip
                  placement="bottom"
                  overlay="Analyzed profit from repaying the loan"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </div>
              <div className={styles.totalValue}>
                58.4 <Solana />
              </div>
            </div>
          </div>
          <Button
            disabled={!isValid && !isChecked}
            onClick={onSubmit}
            className={styles.btn}
            type="secondary"
          >
            {'Create pool'}
          </Button>
        </div>
      </div>
      <OrderBook
        marketPubkey={marketPubkey}
        maxLTV={maxLTV}
        solFee={solFee}
        solDeposit={solDeposit}
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to create Bond"
      />
    </AppLayout>
  );
};

export default PoolsCreationPage;
