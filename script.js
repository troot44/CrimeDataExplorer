// Wait until the web page has loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Form element to see when it is submitted.
    const form = document.getElementById('search-form');

    // Body element where results will be inserted.
    const resultsBody = document.getElementById('results-body');

    // Mock data for use before connection to database.
    /*
    const mockCrimeData = [
        {
          date: "2025-04-15",
          type: "THEFT",
          description: "Stolen bicycle from parking lot",
          location: "5th Street and Elm"
        },
        {
          date: "2025-04-16",
          type: "ASSAULT",
          description: "Physical altercation at bar",
          location: "Main Street Pub"
        },
        {
          date: "2025-04-17",
          type: "THEFT",
          description: "Wallet stolen during festival",
          location: "Town Square"
        },
        {
          date: "2025-04-18",
          type: "BURGLARY",
          description: "Break-in at apartment complex",
          location: "Oak Hill Apartments"
        }
    ];
    */

    // When the form is submitted, execute the following.
    form.addEventListener('submit', function (event) {

        // Prevents the form from reloading the page on submission.
        event.preventDefault();

        // Read the input.
        const crimeTypeInput = document.getElementById('crime-type').value;

        // Puts input into correct format.
        const formattedInput = crimeTypeInput.trim().toUpperCase();

        // Filter for crimes of inputted type.
        /*
        const filteredResults = mockCrimeData.filter(crime => {
            return crime.type === formattedInput;
        });
        */

        // URL for Crime Data
        const baseURL = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json';

        // Build API Query for data, return 25 entries.
        const queryURL = `${baseURL}?$limit=25&primary_type=${formattedInput}`;

        // Loading message while waiting for API.
        resultsBody.innerHTML = '<tr><td colspan="4">Loading data...</td></tr>';

        // Fetch the data from API.
        fetch(queryURL)
            .then(response => {

                // Throw exception for server error.
                if (!response.ok) {
                    throw new Error('Network response was not OK.');
                }

                // Parse JSON response into JS Objects.
                return response.json();
            })

            .then(data => {

                // Clear loading message.
                resultsBody.innerHTML = '';

                // If no results were returned:
                if (data.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.colSpan = 4;
                    cell.textContent = `No Results were found for "${formattedInput}".`;
                    row.appendChild(cell);
                    resultsBody.appendChild(row);
                } else {

                    // Loop through each crime and display in table.
                    data.forEach(crime => {
                        const row = document.createElement('tr');
                        
                        // Display crime date.
                        const dateCell = document.createElement('td');
                        dateCell.textContent = crime.date ? new Date(crime.date).toLocaleDateString() : 'N/A';
                        row.appendChild(dateCell);

                        // Display crime type.
                        const typeCell = document.createElement('td');
                        typeCell.textContent = crime.primary_type || "N/A";
                        row.appendChild(typeCell);

                        // Display crime description.
                        const descCell = document.createElement('td');
                        descCell.textContent = crime.description || 'N/A';
                        row.appendChild(descCell);

                        // Display crime location.
                        const locaCell = document.createElement('td');
                        locaCell.textContent = crime.location_description || 'N/A';
                        row.appendChild(locaCell);

                        // Add rows to the table.
                        resultsBody.appendChild(row);
                    });
                }
            })

            .catch(error => {

                // If there was any issue with fetching or parsing, show error message.
                resultsBody.innerHTML = `<tr><td colspan="4">Error ${error.message}</td></tr>`;
                console.error('Error fetching data:', error);
            })

        /*
        // If no crimes are found, display "No Results".
        if (filteredResults.length === 0) {

             // Create new row.
            const row = document.createElement('tr');

            // Create new cell with four rows.
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = `No results for "${formattedInput}".`;

             // Add cell to row. Add row to table.
            row.appendChild(cell);
            resultsBody.appendChild(row);
        } else {

            // If crimes are found, loop through the results.
            filteredResults.forEach(crime => {
                // Create new table row for each crime.
                const row = document.createElement('tr');

                //Create cell for date and fill in.
                const dateCell = document.createElement('td');
                dateCell.textContent = crime.date;
                row.appendChild(dateCell);

                // Create cell for crime type.
                const typeCell = document.createElement('td');
                typeCell.textContent = crime.type;
                row.appendChild(typeCell);

                // Create a cell for description.
                const descCell = document.createElement('td');
                descCell.textContent = crime.description;
                row.appendChild(descCell);

                 // Create cell for loaction.
                const locationCell = document.createElement('td');
                locationCell.textContent = crime.location;
                row.appendChild(locationCell);

                // Add all rows to table.
                resultsBody.appendChild(row);
            });
        }
        */
    });
});
