// Take the entries of a folder and turn it into a rollable table. 
// If the table exists it appends the results, if no table exists the table is created. Change the description to fit your needs.
// Author: @Atropos#3814 edited for v9 by Freeze#2689

const tableName = "some table name"; // name of table you will be appending, or creating.
const folderName = "some folder"; // name of folder whos Documents you wish to push into a rollable table.

const folder = game.folders.getName(folderName);
const table = game.tables.getName(tableName);
const results = folder.contents.map((i, count) => {
    return {
        text: i.name,
        type: CONST.TABLE_RESULT_TYPES.DOCUMENT,
        collection: folder.type,
        resultId: i.id,
        img: i.img,
        weight: 1,
        range: [count + 1, count + 1],
        drawn: false
    }
});
if(table){
    await table.createEmbeddedDocuments("TableResult", results);
}
else {
    table = await RollTable.createDocuments([{
        name: tableName,
        description: "table description",
        results: results,
        formula: `1d${results.length}`
    }]);
}
