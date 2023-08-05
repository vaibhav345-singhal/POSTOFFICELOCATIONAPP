let iP = "";

function getIp() {
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            iP = data.ip;
            $("#ip").html(`Your Current IP Address is: ${data.ip}`);
        })
        .catch(error => console.error(error));
}

function fetchUserInfo() {
    fetch(`https://ipinfo.io/${iP}/geo`)
        .then(response => response.json())
        .then(data => {
            const latitude = parseFloat(data.loc.split(',')[0]);
            const longitude = parseFloat(data.loc.split(',')[1]);
            const timezone = data.timezone;
            const pincode = data.postal;
            const city = data.city;
            const region = data.region;
            const country = data.country;
            const org = data.org;
            const readme = data.readme;
            let currentTime = "";
            let postOffices = "";
            document.getElementById('ip-address').innerText = "IP Address: " + iP;

            $(".geo-info").html(`
        <p>Lat: ${latitude}</p>
        <p>City: ${city}</p>
        <p>Organization: ${org}</p>
        <p>Long: ${longitude}</p>
        <p>Region: ${region}</p>
        <p>Hostname: ${readme}</p>
      `);

            $("#map").html(`
        <iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed" width="100%" height="400" frameborder="0" style="border:0"></iframe>
      `);

            fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
                .then(response => response.json())
                .then(data => {
                    currentTime = data.datetime;
                    console.log("Current Time for User's Timezone:", currentTime);
                })
                .catch(error => console.error(error));

            fetch(`https://api.postalpincode.in/pincode/${pincode}`)
                .then(response => response.json())
                .then(data => {
                    postOffices = data[0].PostOffice;

                    $(".three").html(`
            <h1>More information About You</h1>
            <h3>Time Zone: ${timezone}</h3>
            <h3>Date And Time: ${currentTime}</h3>
            <h3>PinCode: ${pincode}</h3>
            <h3>Message: ${data[0].Message}</h3>
          `);

                    let postOfficesHtml = "";

                    postOffices.forEach(postOffice => {
                        postOfficesHtml += `
              <div class="post-details">
                <p>Name: ${postOffice.Name}</p>
                <p>Branch Type: ${postOffice.BranchType}</p>
                <p>Delivery Status: ${postOffice.DeliveryStatus}</p>
                <p>District: ${postOffice.District}</p>
                <p>Division: ${postOffice.Division}</p>
              </div>
            `;
                    });

                    $(".post-div").html(`
            ${postOfficesHtml}
          `);

                    const postDetailsDivs = document.querySelectorAll('.post-div .post-details');
                    const postDetailsParagraphs = document.querySelectorAll('.post-div .post-details p');

                    postDetailsDivs.forEach(postDetailsDiv => {
                        postDetailsDiv.style.margin = '10px';
                        postDetailsDiv.style.padding = '10px';
                        postDetailsDiv.style.border = '1px solid #B8BCCC';
                        postDetailsDiv.style.borderRadius = '10px';
                        postDetailsDiv.style.display = 'flex';
                        postDetailsDiv.style.flexDirection = 'column';
                        postDetailsDiv.style.width = '30%';
                        postDetailsDiv.style.backgroundColor = '#575A85';
                        postDetailsDiv.style.color = 'white';
                    });

                    postDetailsParagraphs.forEach(paragraph => {
                        paragraph.style.margin = '5px';
                        paragraph.style.padding = '5px';
                    });
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", function () {
    window.onload = getIp;
    document.querySelector(".btn").addEventListener("click", function () {
        $(".main").hide();
        $(".parent").show();
        fetchUserInfo();
    });


    document.getElementById("searchBtn").addEventListener("click", function () {
        const searchBoxValue = document.getElementById("searchBox").value.trim().toLowerCase();
        const postDetailsDivs = document.querySelectorAll(".post-details");

        postDetailsDivs.forEach(postDetailsDiv => {
            const postOfficeName = postDetailsDiv.querySelector("p:nth-child(1)").innerText.toLowerCase();
            const branchType = postDetailsDiv.querySelector("p:nth-child(2)").innerText.toLowerCase();

            if (postOfficeName.includes(searchBoxValue) || branchType.includes(searchBoxValue)) {
                postDetailsDiv.style.display = "block";
            } else {
                postDetailsDiv.style.display = "none";
            }
        });
    });


});
