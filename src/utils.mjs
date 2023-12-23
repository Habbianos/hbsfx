import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path'

export const exec = promisify(execCallback);


export async function findReplace(caminhoDoArquivo, strings) {
  try {
    const dados = await fs.readFile(caminhoDoArquivo, 'utf8');

    let novoConteudo = dados

    for (const [stringParaEncontrar, novaString] of strings) {
        novoConteudo = novoConteudo.replace(new RegExp(stringParaEncontrar, 'g'), novaString);
    }


    await fs.writeFile(caminhoDoArquivo, novoConteudo, 'utf8');
  } catch (erro) {
    console.error('Erro ao processar o arquivo:', erro);
  }
}

export async function* getSubFolders(caminhoDaPasta, fullPath = true) {
    try {
        const itens = await fs.readdir(caminhoDaPasta);

        for (const item of itens) {
            const caminhoCompleto = path.join(caminhoDaPasta, item);
            const stat = await fs.stat(caminhoCompleto);

            if (stat.isDirectory()) {
                yield fullPath ? caminhoCompleto : item;
            }
        }
    } catch (erro) {
        console.error('Erro ao gerar nomes de pastas:', erro);
    }
}

export async function extractSampleId(logicFilePath) {
    const content = await fs.readFile(logicFilePath, 'utf8')
    const regex = /sample id="(\d+)"/g;
    let match;
    const matches = [];

    while ((match = regex.exec(content)) !== null) {
        const [, sampleId] = match;
        matches.push(+sampleId);
    }

    return matches
}

export async function ensureJsonFileExistsAndGetIt(filePath) {
    try {
      await fs.access(filePath);
      const conteudo = await fs.readFile(filePath, 'utf8');
      return JSON.parse(conteudo);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(filePath, '{}', 'utf8');
        return {}
      } else {
        throw error;
      }
    }
  }

  export async function convertPngToBase64(inputImagePath) {
    try {
      const pngBuffer = await fs.readFile(inputImagePath);
  
      const base64Image = pngBuffer.toString('base64');

      return base64Image
    } catch (error) {
        console.error(error);
        throw new Error("Error converting PNG to JSON")
      }
}

export async function saveJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data))
}

export async function garantirDiretorioExistente(caminho) {
    try {
      await fs.access(caminho);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(caminho);
      } else {
        throw error;
      }
    }
  }