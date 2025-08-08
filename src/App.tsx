import React from "react";
import useFormFields from "./ui/hooks/useFormFields";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import ErrorMessage from "./ui/components/ErrorMessage/ErrorMessage";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import { baseUrl } from "./config/api.config";

function App() {
    const {
    fields: { postCode, houseNumber, firstName, lastName, selectedAddress },
    onChange: handleFieldChange,
    setFields,
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const clearFields = () => {
    setFields({
      postCode: "",
      houseNumber: "",
      firstName: "",
      lastName: "",
      selectedAddress: "",
    })
  }
  /**
   * Fetch addresses based on houseNumber and postCode using the local BE api
   */
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFields((prev) => ({ ...prev, selectedAddress: "" }));
    setError(undefined);
    setAddresses([]);
    setLoading(true);
    try {
      const url = `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(postCode)}&streetnumber=${encodeURIComponent(houseNumber)}`;
      const res = await fetch(url);
      if (!res.ok) {
        setError('Failed to fetch addresses');
        throw new Error('Failed to fetch addresses');
      }
      const data = await res.json();
      setAddresses(data.details);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching addresses');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };


  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handleFieldChange}
                placeholder="Post Code"
                value={postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleFieldChange}
                value={houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={loading}>Find</Button>
          </fieldset>
        </form>
        {loading && <div>Loading addresses...</div>}
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                value={address.id}
                onChange={handleFieldChange}
                checked={selectedAddress === address.id}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFieldChange}
                  value={firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleFieldChange}
                  value={lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        <ErrorMessage message={error || ""} />

        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            clearFields();
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
