import { findReplace, exec, getSubFolders, extractSampleId, ensureJsonFileExistsAndGetIt, convertPngToBase64, saveJson } from './utils.mjs'

await findReplace(
    'node_modules/@jankuss/shroom/dist/tools/dump/downloadAllFiles.js',
    [
        [ '    await downloadFigures_1.downloadFigures',
        '    //await downloadFigures_1.downloadFigures'],
        [ '    await downloadEffects_1.downloadEffects',
        '    //await downloadEffects_1.downloadEffects'],
    ]
);

const outputPath = `public/resources`

// await exec(`shroom dump --url https://www.habbo.com/gamedata/external_variables/1 --location ${outputPath} > /dev/null`)

const newSoundData = new Map()

for await (const revisionNumber of getSubFolders(`${outputPath}/hof_furni`, false)) {
    const revisionPath = `${outputPath}/hof_furni/${revisionNumber}`

    for await (const furniClassname of getSubFolders(revisionPath, false)) {
        const sampleIds = await extractSampleId(`${revisionPath}/${furniClassname}/${furniClassname}_logic.bin`)
        
        if (!sampleIds.length) continue

        newSoundData.set(furniClassname, {
            revision: +revisionNumber,
            sampleIds,
        })
    }
}

const fileDataPath = 'data.json'

const oldData = await ensureJsonFileExistsAndGetIt(fileDataPath)

for (const [furniClassname, data] of newSoundData) {
    const oldFurniData = oldData[furniClassname] ?? {}
    
    if (!oldFurniData[data.revision]) {
        const iconPath = `${outputPath}/hof_furni/${data.revision}/${furniClassname}/${furniClassname}_icon_a.png`
        const iconBase64 = await convertPngToBase64(iconPath)

        const sampleIds = {}
        for (const id of data.sampleIds) {
            sampleIds[id] = await fetch(`http://images.habbo.com/dcr/hof_furni/mp3/sound_machine_sample_${id}.mp3`)
                .then(r => r.arrayBuffer())
                .then(r => new Buffer.from(r, 'binary').toString('base64'))
                .catch(err => {
                    console.error(id, err)
                    throw err
                })
        }

        oldFurniData[data.revision] = {
            icon: iconBase64,
            sampleIds,
        }
    }

    oldData[furniClassname] = oldFurniData
}

await saveJson(fileDataPath, oldData)