import fs from 'fs/promises';
import path from 'path';
import { garantirDiretorioExistente } from './utils.mjs'

const idiomas = [
    {
      codigo: 'hhbr',
      host: 'https://habbo.com.br/',
      texts: {
        tituloPrincipal: 'Efeitos Sonoros',
        paginaInicial: 'Início',
        iconColumn: "Ícone",
        classnameColumn: "Classe",
        nameColumn: "Nome",
        descriptionColumn: "Descrição",
        revisionColumn: "Revisão",
        sampleIdColumn: "Ids dos sons",
        audioColumn: "Áudio",
      }
    },
    {
      codigo: 'hhus',
      host: 'https://habbo.com/',
      texts: {
        tituloPrincipal: 'Sound Effects',
        paginaInicial: 'Home',
        iconColumn: "Icon",
        classnameColumn: "Class",
        nameColumn: "Name",
        descriptionColumn: "Description",
        revisionColumn: "Revision",
        sampleIdColumn: "Sample ids",
        audioColumn: "Audio",
      }
    },
    {
      codigo: 'hhes',
      host: 'https://habbo.es/',
      texts: {
        tituloPrincipal: 'Efectos de Sonido',
        paginaInicial: 'Inicio',
        iconColumn: "Ícono",
        classnameColumn: "Clase",
        nameColumn: "Nombre",
        descriptionColumn: "Descripción",
        revisionColumn: "Revisión",
        sampleIdColumn: "IDs de Muestra",
        audioColumn: "Audio",
      }
    },
    {
      codigo: 'hhnl',
      host: 'https://habbo.nl/',
      texts: {
        tituloPrincipal: 'Geluidseffecten',
        paginaInicial: 'Home',
        iconColumn: "Pictogram",
        classnameColumn: "Klasse",
        nameColumn: "Naam",
        descriptionColumn: "Omschrijving",
        revisionColumn: "Revisie",
        sampleIdColumn: "Monster-ID's",
        audioColumn: "Audio",
      }
    },
    {
      codigo: 'hhfr',
      host: 'https://habbo.fr/',
      texts: {
        tituloPrincipal: 'Effets Sonores',
        paginaInicial: 'Accueil',
        iconColumn: "Icône",
        classnameColumn: "Classe",
        nameColumn: "Nom",
        descriptionColumn: "Description",
        revisionColumn: "Révision",
        sampleIdColumn: "IDs des échantillons",
        audioColumn: "Audio",
      }
    },
    {
      codigo: 'hhde',
      host: 'http://habbo.de/',
      texts: {
        tituloPrincipal: 'Soundeffekte',
        paginaInicial: 'Startseite',
        iconColumn: "Symbol",
        classnameColumn: "Klasse",
        nameColumn: "Name",
        descriptionColumn: "Beschreibung",
        revisionColumn: "Überarbeitung",
        sampleIdColumn: "Sample-IDs",
        audioColumn: "Audio",
      }
    },
    {
      codigo: 'hhfi',
      host: 'https://habbo.fi/',
      texts: {
        tituloPrincipal: 'Äänitehosteet',
        paginaInicial: 'Koti',
        iconColumn: "Kuvake",
        classnameColumn: "Luokka",
        nameColumn: "Nimi",
        descriptionColumn: "Kuvaus",
        revisionColumn: "Revisio",
        sampleIdColumn: "Näyte-IDs",
        audioColumn: "Ääni",
      }
    },
    {
      codigo: 'hhit',
      host: 'https://habbo.it/',
      texts: {
        tituloPrincipal: 'Effetti Sonori',
        paginaInicial: 'Home',
        iconColumn: "Icona",
        classnameColumn: "Classe",
        nameColumn: "Nome",
        descriptionColumn: "Descrizione",
        revisionColumn: "Revisione",
        sampleIdColumn: "ID campione",
        audioColumn: "Audio",
      }
    },
    {
      codigo: 'hhtr',
      host: 'https://habbo.com.tr/',
      texts: {
        tituloPrincipal: 'Ses Efektleri',
        paginaInicial: 'Ana Sayfa',
        iconColumn: "Simge",
        classnameColumn: "Sınıf",
        nameColumn: "Ad",
        descriptionColumn: "Açıklama",
        revisionColumn: "Revizyon",
        sampleIdColumn: "Örnek Kimlikleri",
        audioColumn: "Ses",
      }
    },
  ];  

async function criarPaginaDocsifyParaIdioma(idioma, dados) {
  const { codigo, host, texts } = idioma;

  const furnidata = await fetch(`${host}gamedata/furnidata_json/1`).then(r => r.json())

    await garantirDiretorioExistente(`docs/${codigo}`);

  const classNames = Object.keys(dados);

  // Página inicial
  let tabelaInicial = `# ${texts.tituloPrincipal}

| ${texts.iconColumn} | ${texts.classnameColumn} | ${texts.nameColumn} | ${texts.audioColumn} |
|---|---|---|---|
`;


let sidebarContent = `# ${texts.tituloPrincipal}

- [${texts.paginaInicial}](${codigo}/)
`;

for (const classname of classNames) {
    const furnidataClassname = furnidata.roomitemtypes.furnitype.find(x => x.classname === classname)
    const { name: furniName, description: furniDescription } = furnidataClassname

    const revisions = dados[classname];
    
    let paginaMarkdown = `# \`${classname}\` ${furniName}

${furniDescription}
    
| ${texts.iconColumn} | ${texts.revisionColumn} | ${texts.sampleIdColumn} | ${texts.audioColumn} |
|---|---|---|---|
    `;
    
    let lastIcon
    for (const revision in revisions) {
        const { icon, sampleIds } = revisions[revision];
        lastIcon = icon
        paginaMarkdown += `| ![Icon](data:image/png;base64,${icon}) | ${revision} | ${Object.keys(sampleIds).map(x => `[${x}](http://images.habbo.com/dcr/hof_furni/mp3/sound_machine_sample_${x}.mp3)`).join(', ')} | ${Object.keys(sampleIds).map(x => `<audio controls src="data:audio/mp3;base64,${sampleIds[x]}" />`)} |\n`;
    }
    
    const lastSampleIds = revisions[Object.keys(revisions)[Object.keys(revisions).length-1]].sampleIds
    tabelaInicial += `| ![Icon](data:image/png;base64,${lastIcon}) | [${classname}](${codigo}/${classname}) | [${furniName}](${codigo}/${classname}) | ${Object.keys(lastSampleIds).map(x => `<audio controls src="data:audio/mp3;base64,${lastSampleIds[x]}" />`)} |\n`;
    await fs.writeFile(`docs/${codigo}/${classname}.md`, paginaMarkdown, 'utf8');

    sidebarContent += `- [${furniName}](${codigo}/${classname})\n`;
  }

  await fs.writeFile(`docs/${codigo}/README.md`, tabelaInicial, 'utf8');

  await fs.writeFile(`docs/${codigo}/_sidebar.md`, sidebarContent, 'utf8');
  if (codigo == 'hhbr') await fs.writeFile(`docs/_sidebar.md`, sidebarContent, 'utf8');

  console.log(`Docsify pages for ${codigo} language created successfully.`);

}

const caminhoArquivoJson = 'data.json';
const dadosJson = await fs.readFile(caminhoArquivoJson, 'utf8');
const dados = JSON.parse(dadosJson);

for (const idioma of idiomas) {
    
    await criarPaginaDocsifyParaIdioma(idioma, dados);
}

const navbarContent = idiomas
    .map(locale => `- [${locale.codigo}](${locale.codigo}/)`)
    .join('\n');

await fs.writeFile('docs/_navbar.md', navbarContent, 'utf8');
