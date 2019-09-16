const baseSql = 'select * from "DATALAKE_DB"."ALIGNE"."EBB_NOMINATIONS"';

export const execute = (connection: any, specifics: string = ''): Promise<any> =>
  new Promise((resolve, reject) => {
    let rows: any[] = [];

    const statement = connection.execute({
      sqlText: `${baseSql} ${specifics};`
    });

    const stream = statement.streamRows();

    stream.on('error', function(err: any) {
      const message = `Unable to consume all rows, ${JSON.stringify(err)}`;
      console.error(message);
      reject(message);
    });

    stream.on('data', function(row: any) {
      rows = [...rows, row];
    });

    stream.on('end', function() {
      resolve(rows);
    });
  });
