

document.addEventListener("DOMContentLoaded", function () {
    const url = "https://opensheet.elk.sh/1wTvyGj1RdO-vfD0IqfkGi-6FwI--9IuqGq26YBoruGc/ALLLeaderboards";
    let studentList = [];
    let top10 = [];
    let filteredStudents = [];
    let paginatedStudents = [];
    let schoolNames = [];

    let currentPage = 2;
    let pageSize = 10;

    const searchInput = document.getElementById("searchInput");
    const schoolSelected = document.getElementById("schoolSelected");

    const top10div = document.getElementById("top10-ranking");
    const allRanking = document.getElementById("all-ranking");

    fetch(url)
        .then(response => response.json())
        .then(data => {
            studentList = data
                .sort((a, b) => b.Point - a.Point)
                .map((student, index) => {
                    student.Rank = index + 1;
                    return student;
                });

            schoolNames = Array.from(new Set(studentList.map(student => student["School Name"]))).sort();

            top10 = studentList.slice(0, 10);
            console.log(top10);
            updateTop10();
            populateSchoolDropdown();
            filteredStudents = filterStudents();
            updateAll();
            updatePodium();

            searchInput.addEventListener("input", () => {
                filteredStudents = filterStudents();
                updatePagination();
                updateAll();
                console.log(paginatedStudents);
            })

            schoolSelected.addEventListener("change", () => {
                filteredStudents = filterStudents();
                updatePagination();
                updateAll();
                console.log(paginatedStudents);
            });
        })
        .catch(error => {
            console.error("Failed to fetch data:", error);
        });


    function updatePodium() {
        const podium = document.getElementById('badgeContainer');
        podium.innerHTML = ''; // Clear existing cards

        podium.innerHTML = `
        <div class="flex justify-center items-center space-x-12 mb-12">

            <!-- Rank 3 -->
            <div class="flex flex-col w-80 pt-20">
                <div class="flex flex-col ml-4 items-center relative">
                    <img src="src/leafy-green.png" alt="" class="absolute z-10">
                    <img class="w-32 h-32 rounded-full relative shadow-[0_0px_60px_8px_rgba(8,_112,_184,_0.7)]" src="${top10[2]["Avatar URL"]}" alt="avatar">
                    <div class="text-white text-lg font-bold mt-8 p-2">${top10[2]["Student Name"]}</div>
                    <div class="text-orange-400 text-lg font-bold p-2">Rank #3</div>
                </div>
                <div style="background-image: url('src/podium.png');" class="bg-no-repeat bg-contain h-36">
                    <div class="flex justify-between text-white px-6 py-4 mt-10">
                        <div>
                            <img class="h-24 animate-pulse" src="src/guardian.png" alt="Badge">
                        </div>
                        <div class="flex flex-col justify-center text-left">
                            <div class="w-40 font-bold">${top10[2]["School Name"]}</div>
                            <div>
                                <span class="text-indigo-900 font-bold">${top10[2]["Point"]}</span> Points
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rank 1 -->
            <div class="flex flex-col w-80">
                <div class="flex flex-col ml-4 items-center relative">
                    <img src="src/leafy-red.png" alt="" class="absolute top-0 z-10">
                    <img class="w-32 h-32 rounded-full relative shadow-[0_0px_60px_8px_rgba(8,_112,_184,_0.7)]" src="${top10[0]["Avatar URL"]}" alt="avatar">
                    <div class="text-white text-lg font-bold mt-8 p-2">${top10[0]["Student Name"]}</div>
                    <div class="text-red-400 text-lg font-bold p-2">Rank #1</div>
                </div>
                <div style="background-image: url('src/podium.png');" class="bg-no-repeat bg-contain h-36">
                    <div class="flex justify-between text-white px-6 py-4 mt-10">
                        <div>
                            <img class="h-24 animate-pulse" src="src/guardian.png" alt="Badge">
                        </div>
                        <div class="flex flex-col justify-center text-left">
                            <div class="w-40 font-bold">${top10[0]["School Name"]}</div>
                            <div>
                                <span class="text-indigo-900 font-bold">${top10[0]["Point"]}</span> Points
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rank 2 -->
            <div class="flex flex-col w-80 pt-8">
                <div class="flex flex-col ml-4 items-center relative">
                    <img src="src/leafy-blue.png" alt="" class="absolute top-2 z-10">
                    <img class="w-32 h-32 rounded-full relative shadow-[0_0px_60px_8px_rgba(8,_112,_184,_0.7)]" src="${top10[1]["Avatar URL"]}" alt="avatar">
                    <div class="text-white text-lg font-bold mt-8 p-2">${top10[1]["Student Name"]}</div>
                    <div class="text-blue-400 text-lg font-bold p-2">Rank #2</div>
                </div>
                <div style="background-image: url('src/podium.png');" class="bg-no-repeat bg-contain h-36">
                    <div class="flex justify-between text-white px-6 py-4 mt-10">
                        <div>
                            <img class="h-24 animate-pulse" src="src/guardian.png" alt="Badge">
                        </div>
                        <div class="flex flex-col justify-center text-left">
                            <div class="w-40 font-bold">${top10[1]["School Name"]}</div>
                            <div>
                                <span class="text-indigo-900 font-bold">${top10[1]["Point"]}</span> Points
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        `;
    }


    function updateTop10() {
        top10div.innerHTML = "";
        top10.forEach(student => {
            top10div.innerHTML += `
                <tr class="mt-4 rounded-full transition-colors hover:bg-slate-700/50">
                    <td class="pl-4 rounded-tl-full rounded-bl-full">
                        <div class="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-lg">
                            ${student["Rank"]}
                        </div>
                    </td>

                    <td>
                        <div class="flex items-center space-x-4">
                            <img class="w-16 h-16 rounded-full hidden md:block" src="${student["Avatar URL"] || "src/default.png"}" alt="avatar">
                            <div class="flex flex-col justify-center">
                                <div class="text-white text-lg font-bold">${student["Student Name"]}</div>
                                <div class="text-slate-500 text-sm">${student["School Name"]}</div>
                            </div>
                        </div>
                    </td>

                    <td class="text-white text-lg font-bold text-center align-middle sm:block hidden">
                        ${student["Point"]}
                    </td>

                    <td class="pr-4 rounded-tr-full rounded-br-full">
                        <div class="flex justify-end">
                            <img class="w-12 rounded-full" src="${pointToBadge(student["Point"])}" alt="guardian avatar">
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    function updateAll() {
        const pageSize = 10;
        const startIndex = (currentPage - 1) * pageSize;
        paginatedStudents = filteredStudents.slice(startIndex, startIndex + pageSize);

        allRanking.innerHTML = "";
        paginatedStudents.forEach(student => {
            allRanking.innerHTML += `
                <tr class="mt-4 rounded-full transition-colors hover:bg-slate-700/50">
                    <td class="pl-4 rounded-tl-full rounded-bl-full">
                        <div class="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-lg">
                            ${student["Rank"]}
                        </div>
                    </td>

                    <td>
                        <div class="flex items-center space-x-4">
                            <img class="w-16 h-16 rounded-full hidden md:block" src="${student["Avatar URL"] || "src/default.png"}" alt="avatar">
                            <div class="flex flex-col justify-center">
                                <div class="text-white text-lg font-bold">${student["Student Name"]}</div>
                                <div class="text-slate-500 text-sm">${student["School Name"]}</div>
                            </div>
                        </div>
                    </td>

                    <td class="text-white text-lg font-bold text-center align-middle sm:block hidden">
                        ${student["Point"]}
                    </td>

                    <td class="pr-4 rounded-tr-full rounded-br-full">
                        <div class="flex justify-end">
                            <img class="w-12 rounded-full" src="${pointToBadge(student["Point"])}" alt="guardian avatar">
                        </div>
                    </td>
                </tr>
            `;
        });

        updatePagination();
    }

    function filterStudents() {
        const schoolName = schoolSelected.value;
        const searchQuery = searchInput.value.toLowerCase();

        return studentList.filter(student => {
            const schoolMatch = schoolName === "All" || student["School Name"] === schoolName;
            const searchMatch = searchQuery === "" ||
                student["Student Name"].toLowerCase().includes(searchQuery) ||
                student["School Name"].toLowerCase().includes(searchQuery);

            return schoolMatch && searchMatch;
        });
    }

    function updatePagination() {
        const pageSize = 10;
        const totalPages = Math.ceil(filteredStudents.length / pageSize);
        const paginationContainer = document.getElementById("paginationOptions");

        // Clamp currentPage within valid range
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // Clear existing buttons
        paginationContainer.innerHTML = "";

        // Wrapper for styling
        const paginationWrapper = document.createElement("div");
        paginationWrapper.className = "flex items-center space-x-2 text-gray-400 text-sm";

        // Helper to create a button
        const createButton = (text, isActive = false, isDisabled = false, onClick = null) => {
            const span = document.createElement("span");
            span.textContent = text;
            span.className = `px-2 py-1 rounded ${isActive ? "bg-blue-500 text-white" : "hover:bg-slate-700"} ${isDisabled ? "opacity-50 cursor-default" : "cursor-pointer"}`;
            if (!isDisabled && typeof onClick === "function") {
                span.addEventListener("click", onClick);
            }
            return span;
        };

        // Previous Button
        paginationWrapper.appendChild(
            createButton("Prev", false, currentPage === 1, () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateAll();
                }
            })
        );

        // Pagination Numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            paginationWrapper.appendChild(createButton("1", currentPage === 1, false, () => {
                currentPage = 1;
                updateAll();
            }));
            if (startPage > 2) {
                const dots = document.createElement("span");
                dots.textContent = "...";
                paginationWrapper.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationWrapper.appendChild(createButton(
                i.toString(),
                i === currentPage,
                false,
                () => {
                    currentPage = i;
                    updateAll();
                }
            ));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement("span");
                dots.textContent = "...";
                paginationWrapper.appendChild(dots);
            }
            paginationWrapper.appendChild(createButton(totalPages.toString(), currentPage === totalPages, false, () => {
                currentPage = totalPages;
                updateAll();
            }));
        }

        // Next Button
        paginationWrapper.appendChild(
            createButton("Next", false, currentPage === totalPages, () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateAll();
                }
            })
        );

        paginationContainer.appendChild(paginationWrapper);
    }

    function populateSchoolDropdown() {
        const dropdown = document.getElementById("schoolSelected");

        let optionsHTML = `<option value="All" selected>All</option>`;
        
        schoolNames.forEach(name => {
            optionsHTML += `<option value="${name}">${name}</option>`;
        });

        dropdown.innerHTML = optionsHTML;
    }

    function pointToBadge(points){
        switch (true) {
            case points >= 400:
                return "src/legend.png";
            case points >= 250:
                return "src/guardian.png";
            case points >= 150:
                return "src/knight.png";
            case points >= 100:
                return "src/creator.png";
            case points >= 50:
                return "src/initiator.png";
            case points >= 0:
                return "src/newbie.png";
        }
    }
});
