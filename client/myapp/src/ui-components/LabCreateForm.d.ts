/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LabCreateFormInputValues = {
    sshKey?: string;
    bastionHost?: string;
    user1Secret?: string;
};
export declare type LabCreateFormValidationValues = {
    sshKey?: ValidationFunction<string>;
    bastionHost?: ValidationFunction<string>;
    user1Secret?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LabCreateFormOverridesProps = {
    LabCreateFormGrid?: FormProps<GridProps>;
    sshKey?: FormProps<TextFieldProps>;
    bastionHost?: FormProps<TextFieldProps>;
    user1Secret?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LabCreateFormProps = React.PropsWithChildren<{
    overrides?: LabCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LabCreateFormInputValues) => LabCreateFormInputValues;
    onSuccess?: (fields: LabCreateFormInputValues) => void;
    onError?: (fields: LabCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: LabCreateFormInputValues) => LabCreateFormInputValues;
    onValidate?: LabCreateFormValidationValues;
} & React.CSSProperties>;
export default function LabCreateForm(props: LabCreateFormProps): React.ReactElement;
