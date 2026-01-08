const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../agency_list_raw.txt');
const outputPath = path.join(__dirname, '../orgaos.html');

try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const lines = rawData.split('\n');

    let currentCategory = 'Resumo dos códigos mais utilizados (Paraná)';
    const categories = {
        'Resumo dos códigos mais utilizados (Paraná)': [],
        'Orgãos Federais': [],
        'Orgãos Estaduais': [],
        'Orgãos Municipais': []
    };

    // Mapping headers in text to keys
    const categoryMap = {
        'RESUMO DOS CÓDIGOS': 'Resumo dos códigos mais utilizados (Paraná)',
        'ÓRGÃOS FEDERAIS': 'Orgãos Federais',
        'ÓRGÃOS ESTADUAIS': 'Orgãos Estaduais',
        'ÓRGÃOS MUNICIPAIS': 'Orgãos Municipais'
    };

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Check for category headers
        let isHeader = false;
        for (const [key, value] of Object.entries(categoryMap)) {
            if (line.toUpperCase().includes(key)) {
                currentCategory = value;
                isHeader = true;
                break;
            }
        }
        if (isHeader) return;

        // Parse agency line (Format: CODE Agency Name)
        // Regex to match strictly 6 digits followed by text
        const match = line.match(/^(\d{6,})\s+(.+)$/);

        if (match) {
            const code = match[1];
            let name = match[2].trim();

            // Cleanup common prefixes/suffixes if needed (optional)
            // For now, keep as is to match user input fidelity

            if (categories[currentCategory]) {
                categories[currentCategory].push({ code, name });
            }
        }
    });

    // Generate HTML Sections
    let htmlContent = '';

    const sectionIcons = {
        'Resumo dos códigos mais utilizados (Paraná)': 'fas fa-map-marker-alt',
        'Orgãos Federais': 'fas fa-flag',
        'Orgãos Estaduais': 'fas fa-landmark',
        'Orgãos Municipais': 'fas fa-city'
    };

    for (const [category, agencies] of Object.entries(categories)) {
        if (agencies.length === 0) continue;

        const iconClass = sectionIcons[category] || 'fas fa-building';

        htmlContent += `
        <div class="category-section">
            <h2 class="category-title"><i class="${iconClass}"></i>${category}</h2>
            <div class="agency-grid">
`;

        agencies.forEach(agency => {
            htmlContent += `                <div class="agency-item">
                    <span class="agency-code">${agency.code}</span>
                    <span class="agency-name">${agency.name}</span>
                </div>
`;
        });

        htmlContent += `            </div>
        </div>
`;
    }

    // Read existing HTML and replace content
    let htmlFile = fs.readFileSync(outputPath, 'utf8');

    // Regex to find the main content area to replace
    // Searching for the container where we previously put the list
    // We look for start of first category and end of last category or specific markers
    // Since we don't have explicit markers, let's use the known structure within <main class="container">

    const startMarker = '<main class="container">';
    const endMarker = '</main>';

    // Construct new Main Content
    const newMainContent = `${startMarker}
        <h1 class="page-title">Orgãos Autuadores de Trânsito</h1>
        <p class="page-subtitle">Consulte a lista completa de códigos e nomes dos órgãos autuadores.</p>
        
        <div class="search-box-container" style="margin-bottom: 30px;">
             <input type="text" id="agencySearch" placeholder="Pesquisar por código ou nome..." class="form-control" onkeyup="filterAgencies()">
        </div>

        <div id="agenciesList">
            ${htmlContent}
        </div>
    `;

    // Simple robust replacement: replace everything inside <main> or rebuild the file if structure is simple
    // Validating current file structure
    const regex = /<main class="container">[\s\S]*?<\/main>/;

    if (regex.test(htmlFile)) {
        htmlFile = htmlFile.replace(regex, newMainContent + endMarker); // regex includes end marker? No, usually greedy.
        // Better:
        const parts = htmlFile.split('<main class="container">');
        const headerPart = parts[0];
        const footerPart = parts[1].split('</main>')[1];

        const finalHtml = headerPart + newMainContent + footerPart;
        fs.writeFileSync(outputPath, finalHtml);
        console.log('Successfully updated orgaos.html');
    } else {
        console.error('Could not find <main class="container"> in orgaos.html');
    }

} catch (err) {
    console.error('Error processing agencies:', err);
}
