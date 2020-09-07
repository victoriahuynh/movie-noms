import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";


const Search = (props) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchInputChanges = (e) => {
        setSearchValue(e.target.value);
    }

    const resetInputField = () => {
        setSearchValue("")
    }

    const callSearchFunction = (e) => {
        e.preventDefault();
        props.search(searchValue);
        resetInputField();
    }

    return (
        <InputGroup className="searchBar">
            <FormControl value={searchValue} onChange={handleSearchInputChanges}
                placeholder="e.g. Shrek"
                aria-label="Movie Name"
                aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
                <Button variant="primary" onClick={callSearchFunction}>Search</Button>
            </InputGroup.Append>
        </InputGroup>
    );
}

export default Search;