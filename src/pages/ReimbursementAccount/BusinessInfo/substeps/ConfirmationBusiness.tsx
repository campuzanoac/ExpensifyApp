import type {CONST as COMMON_CONST} from 'expensify-common/lib/CONST';
import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import CheckboxWithLabel from '@components/CheckboxWithLabel';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';
import TextLink from '@components/TextLink';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import getSubstepValues from '@pages/ReimbursementAccount/utils/getSubstepValues';
import CONST from '@src/CONST';
import type {TranslationPaths} from '@src/languages/types';
import ONYXKEYS from '@src/ONYXKEYS';
import type {ReimbursementAccount, ReimbursementAccountForm} from '@src/types/onyx';
import type * as OnyxCommon from '@src/types/onyx/OnyxCommon';
import type {ReimbursementAccountDraftValues} from '@src/types/onyx/ReimbursementAccountDraft';

type ConfirmationBusinessOnyxProps = {
    /** Reimbursement account from ONYX */
    reimbursementAccount: OnyxEntry<ReimbursementAccount>;

    /** The draft values of the bank account being setup */
    reimbursementAccountDraft: OnyxEntry<ReimbursementAccountForm>;
};

type ConfirmationBusinessProps = ConfirmationBusinessOnyxProps & SubStepProps;

type States = keyof typeof COMMON_CONST.STATES;

const BUSINESS_INFO_STEP_KEYS = CONST.BANK_ACCOUNT.BUSINESS_INFO_STEP.INPUT_KEY;
const BUSINESS_INFO_STEP_INDEXES = CONST.REIMBURSEMENT_ACCOUNT_SUBSTEP_INDEX.BUSINESS_INFO;

const validate = (values: ReimbursementAccountDraftValues): OnyxCommon.Errors => {
    const errors = ValidationUtils.getFieldRequiredErrors(values, [BUSINESS_INFO_STEP_KEYS.HAS_NO_CONNECTION_TO_CANNABIS]);

    if (!values.hasNoConnectionToCannabis) {
        errors.hasNoConnectionToCannabis = 'bankAccount.error.restrictedBusiness';
    }

    return errors;
};

function ConfirmationBusiness({reimbursementAccount, reimbursementAccountDraft, onNext, onMove}: ConfirmationBusinessProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const values = useMemo(() => getSubstepValues(BUSINESS_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);

    const defaultCheckboxState = reimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEYS.HAS_NO_CONNECTION_TO_CANNABIS] ?? false;

    return (
        <ScreenWrapper
            testID={ConfirmationBusiness.displayName}
            style={[styles.pt0]}
        >
            <ScrollView contentContainerStyle={styles.flexGrow1}>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('businessInfoStep.letsDoubleCheck')}</Text>
                <MenuItemWithTopDescription
                    description={translate('businessInfoStep.businessName')}
                    title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_NAME]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.BUSINESS_NAME);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('businessInfoStep.taxIDNumber')}
                    title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_TAX_ID]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.TAX_ID_NUMBER);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('common.companyAddress')}
                    title={`${values[BUSINESS_INFO_STEP_KEYS.STREET]}, ${values[BUSINESS_INFO_STEP_KEYS.CITY]}, ${values[BUSINESS_INFO_STEP_KEYS.STATE]} ${
                        values[BUSINESS_INFO_STEP_KEYS.ZIP_CODE]
                    }`}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.COMPANY_ADDRESS);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('common.phoneNumber')}
                    title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_PHONE]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.PHONE_NUMBER);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('businessInfoStep.companyWebsite')}
                    title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_WEBSITE]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.COMPANY_WEBSITE);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('businessInfoStep.companyType')}
                    title={translate(`businessInfoStep.incorporationType.${values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_TYPE]}` as TranslationPaths)}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.COMPANY_TYPE);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('businessInfoStep.incorporationDate')}
                    title={values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_DATE]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.INCORPORATION_DATE);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('businessInfoStep.incorporationState')}
                    title={translate(`allStates.${values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_STATE] as States}.stateName`)}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(BUSINESS_INFO_STEP_INDEXES.INCORPORATION_STATE);
                    }}
                />
                <FormProvider
                    formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
                    validate={validate}
                    onSubmit={onNext}
                    scrollContextEnabled
                    submitButtonText={translate('common.confirm')}
                    style={[styles.mh5, styles.flexGrow1]}
                >
                    <InputWrapper
                        InputComponent={CheckboxWithLabel}
                        aria-label={`${translate('businessInfoStep.confirmCompanyIsNot')} ${translate('businessInfoStep.listOfRestrictedBusinesses')}`}
                        inputID={BUSINESS_INFO_STEP_KEYS.HAS_NO_CONNECTION_TO_CANNABIS}
                        defaultValue={defaultCheckboxState}
                        LabelComponent={() => (
                            <Text>
                                {`${translate('businessInfoStep.confirmCompanyIsNot')} `}
                                <TextLink href={CONST.LIST_OF_RESTRICTED_BUSINESSES}>{`${translate('businessInfoStep.listOfRestrictedBusinesses')}.`}</TextLink>
                            </Text>
                        )}
                        style={[styles.mt3]}
                        shouldSaveDraft
                    />
                </FormProvider>
            </ScrollView>
        </ScreenWrapper>
    );
}

ConfirmationBusiness.displayName = 'ConfirmationBusiness';

export default withOnyx<ConfirmationBusinessProps, ConfirmationBusinessOnyxProps>({
    reimbursementAccount: {
        key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
    },
    reimbursementAccountDraft: {
        key: ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT,
    },
})(ConfirmationBusiness);
