import React from 'react'

const Searchin = ({ Searchin, setSearchin }) => {
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="searchicon" />

                <input type="text"
                    value={Searchin}
                    onChange={(e) => setSearchin(e.target.value)}
                    placeholder='Search Throgh Thousands of Movies' />
            </div>
        </div>
    )
}

export default Searchin;