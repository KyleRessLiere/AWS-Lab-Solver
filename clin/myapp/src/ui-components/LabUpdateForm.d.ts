/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Lab } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LabUpdateFormInputValues = {
    sshKey?: string;
    bastionHost?: string;
    user1Secret?: string;
};
export declare type LabUpdateFormValidationValues = {
    sshKey?: ValidationFunction<string>;
    bastionHost?: ValidationFunction<string>;
    user1Secret?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LabUpdateFormOverridesProps = {
    LabUpdateFormGrid?: FormProps<GridProps>;
    sshKey?: FormProps<TextFieldProps>;
    bastionHost?: FormProps<TextFieldProps>;
    user1Secret?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LabUpdateFormProps = React.PropsWithChildren<{
    overrides?: LabUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    lab?: Lab;
    onSubmit?: (fields: LabUpdateFormInputValues) => LabUpdateFormInputValues;
    onSuccess?: (fields: LabUpdateFormInputValues) => void;
    onError?: (fields: LabUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: LabUpdateFormInputValues) => LabUpdateFormInputValues;
    onValidate?: LabUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LabUpdateForm(props: LabUpdateFormProps): React.ReactElement;
