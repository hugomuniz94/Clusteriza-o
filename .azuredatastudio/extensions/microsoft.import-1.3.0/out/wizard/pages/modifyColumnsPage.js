"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyColumnsPage = void 0;
const azdata = require("azdata");
const importPage_1 = require("../api/importPage");
const constants = require("../../common/constants");
class ModifyColumnsPage extends importPage_1.ImportPage {
    constructor() {
        super(...arguments);
        this.categoryValues = [
            { name: 'bigint', displayName: 'bigint' },
            { name: 'binary(50)', displayName: 'binary(50)' },
            { name: 'bit', displayName: 'bit' },
            { name: 'char(10)', displayName: 'char(10)' },
            { name: 'date', displayName: 'date' },
            { name: 'datetime', displayName: 'datetime' },
            { name: 'datetime2(7)', displayName: 'datetime2(7)' },
            { name: 'datetimeoffset(7)', displayName: 'datetimeoffset(7)' },
            { name: 'decimal(18, 10)', displayName: 'decimal(18, 10)' },
            { name: 'float', displayName: 'float' },
            { name: 'geography', displayName: 'geography' },
            { name: 'geometry', displayName: 'geometry' },
            { name: 'hierarchyid', displayName: 'hierarchyid' },
            { name: 'int', displayName: 'int' },
            { name: 'money', displayName: 'money' },
            { name: 'nchar(10)', displayName: 'nchar(10)' },
            { name: 'ntext', displayName: 'ntext' },
            { name: 'numeric(18, 0)', displayName: 'numeric(18, 0)' },
            { name: 'nvarchar(50)', displayName: 'nvarchar(50)' },
            { name: 'nvarchar(MAX)', displayName: 'nvarchar(MAX)' },
            { name: 'real', displayName: 'real' },
            { name: 'smalldatetime', displayName: 'smalldatetime' },
            { name: 'smallint', displayName: 'smallint' },
            { name: 'smallmoney', displayName: 'smallmoney' },
            { name: 'sql_variant', displayName: 'sql_variant' },
            { name: 'text', displayName: 'text' },
            { name: 'time(7)', displayName: 'time(7)' },
            { name: 'timestamp', displayName: 'timestamp' },
            { name: 'tinyint', displayName: 'tinyint' },
            { name: 'uniqueidentifier', displayName: 'uniqueidentifier' },
            { name: 'varbinary(50)', displayName: 'varbinary(50)' },
            { name: 'varbinary(MAX)', displayName: 'varbinary(MAX)' },
            { name: 'varchar(50)', displayName: 'varchar(50)' },
            { name: 'varchar(MAX)', displayName: 'varchar(MAX)' }
        ];
    }
    get table() {
        return this._table;
    }
    set table(table) {
        this._table = table;
    }
    get loading() {
        return this._loading;
    }
    set loading(loading) {
        this._loading = loading;
    }
    get text() {
        return this._text;
    }
    set text(text) {
        this._text = text;
    }
    get form() {
        return this._form;
    }
    set form(form) {
        this._form = form;
    }
    static convertMetadata(column) {
        return [column.columnName, column.dataType, false, column.nullable];
    }
    async start() {
        this.loading = this.view.modelBuilder.loadingComponent().component();
        this.table = this.view.modelBuilder.declarativeTable().component();
        this.text = this.view.modelBuilder.text().component();
        this.table.onDataChanged((e) => {
            this.model.proseColumns = [];
            this.table.data.forEach((row) => {
                this.model.proseColumns.push({
                    columnName: row[0].value,
                    dataType: row[1].value,
                    primaryKey: row[2].value,
                    nullable: row[3].value
                });
            });
        });
        this.form = this.view.modelBuilder.formContainer()
            .withFormItems([
            {
                component: this.text,
                title: ''
            },
            {
                component: this.table,
                title: ''
            }
        ], {
            horizontal: false,
            componentWidth: '100%'
        }).component();
        this.loading.component = this.form;
        await this.view.initializeModel(this.form);
        return true;
    }
    async onPageEnter() {
        this.loading.loading = true;
        await this.populateTable();
        this.instance.changeNextButtonLabel(constants.importDataText);
        this.loading.loading = false;
        return true;
    }
    async onPageLeave() {
        this.instance.changeNextButtonLabel(constants.nextText);
        return undefined;
    }
    async cleanup() {
        delete this.model.proseColumns;
        this.instance.changeNextButtonLabel(constants.nextText);
        return true;
    }
    setupNavigationValidator() {
        this.instance.registerNavigationValidator((info) => {
            return !this.loading.loading && this.table.data && this.table.data.length > 0;
        });
    }
    async populateTable() {
        let data = [];
        this.model.proseColumns.forEach((column) => {
            data.push(ModifyColumnsPage.convertMetadata(column));
        });
        this.table.updateProperties({
            columns: [{
                    displayName: constants.columnNameText,
                    valueType: azdata.DeclarativeDataType.string,
                    width: '150px',
                    isReadOnly: false
                }, {
                    displayName: constants.dataTypeText,
                    valueType: azdata.DeclarativeDataType.editableCategory,
                    width: '150px',
                    isReadOnly: false,
                    categoryValues: this.categoryValues
                }, {
                    displayName: constants.primaryKeyText,
                    valueType: azdata.DeclarativeDataType.boolean,
                    width: '100px',
                    isReadOnly: false,
                    showCheckAll: true
                }, {
                    displayName: constants.allowNullsText,
                    valueType: azdata.DeclarativeDataType.boolean,
                    isReadOnly: false,
                    width: '100px',
                    showCheckAll: true
                }],
            data: data
        });
    }
}
exports.ModifyColumnsPage = ModifyColumnsPage;
//# sourceMappingURL=modifyColumnsPage.js.map