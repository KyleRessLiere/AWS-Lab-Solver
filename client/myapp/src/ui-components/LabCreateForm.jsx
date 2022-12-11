/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { Lab } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
export default function LabCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    sshKey: undefined,
    bastionHost: undefined,
    user1Secret: undefined,
  };
  const [sshKey, setSshKey] = React.useState(initialValues.sshKey);
  const [bastionHost, setBastionHost] = React.useState(
    initialValues.bastionHost
  );
  const [user1Secret, setUser1Secret] = React.useState(
    initialValues.user1Secret
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setSshKey(initialValues.sshKey);
    setBastionHost(initialValues.bastionHost);
    setUser1Secret(initialValues.user1Secret);
    setErrors({});
  };
  const validations = {
    sshKey: [],
    bastionHost: [],
    user1Secret: [],
  };
  const runValidationTasks = async (fieldName, value) => {
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          sshKey,
          bastionHost,
          user1Secret,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          await DataStore.save(new Lab(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, "LabCreateForm")}
    >
      <TextField
        label="Ssh key"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sshKey: value,
              bastionHost,
              user1Secret,
            };
            const result = onChange(modelFields);
            value = result?.sshKey ?? value;
          }
          if (errors.sshKey?.hasError) {
            runValidationTasks("sshKey", value);
          }
          setSshKey(value);
        }}
        onBlur={() => runValidationTasks("sshKey", sshKey)}
        errorMessage={errors.sshKey?.errorMessage}
        hasError={errors.sshKey?.hasError}
        {...getOverrideProps(overrides, "sshKey")}
      ></TextField>
      <TextField
        label="Bastion host"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sshKey,
              bastionHost: value,
              user1Secret,
            };
            const result = onChange(modelFields);
            value = result?.bastionHost ?? value;
          }
          if (errors.bastionHost?.hasError) {
            runValidationTasks("bastionHost", value);
          }
          setBastionHost(value);
        }}
        onBlur={() => runValidationTasks("bastionHost", bastionHost)}
        errorMessage={errors.bastionHost?.errorMessage}
        hasError={errors.bastionHost?.hasError}
        {...getOverrideProps(overrides, "bastionHost")}
      ></TextField>
      <TextField
        label="User1 secret"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sshKey,
              bastionHost,
              user1Secret: value,
            };
            const result = onChange(modelFields);
            value = result?.user1Secret ?? value;
          }
          if (errors.user1Secret?.hasError) {
            runValidationTasks("user1Secret", value);
          }
          setUser1Secret(value);
        }}
        onBlur={() => runValidationTasks("user1Secret", user1Secret)}
        errorMessage={errors.user1Secret?.errorMessage}
        hasError={errors.user1Secret?.hasError}
        {...getOverrideProps(overrides, "user1Secret")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, "CancelButton")}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
