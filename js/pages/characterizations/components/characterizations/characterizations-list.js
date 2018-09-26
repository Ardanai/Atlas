define([
    'knockout',
    'pages/characterizations/services/CharacterizationService',
    'pages/characterizations/services/PermissionService',
    'text!./characterizations-list.html',
    'appConfig',
    'services/AuthService',
    'providers/Component',
    'utils/CommonUtils',
    'utils/DatatableUtils',
    'pages/characterizations/const',
    '../tabbed-grid',
    'less!./characterizations-list.less',
    'components/ac-access-denied',
], function (
    ko,
    CharacterizationService,
    PermissionService,
    view,
    config,
    AuthService,
    Component,
    commonUtils,
    datatableUtils,
    constants,
) {
    class Characterizations extends Component {
        constructor(params) {
            super();

            this.gridTab = constants.characterizationsTab;

            this.loading = ko.observable(false);
            this.data = ko.observableArray();

            this.isGetCCListPermitted = PermissionService.isPermittedGetCCList;
            this.isCreatePermitted = PermissionService.isPermittedCreateCC;

            this.gridColumns = [
                {
                    title: 'Name',
                    data: 'name',
                    className: this.classes('tbl-col', 'name'),
                    render: datatableUtils.getLinkFormatter(d => ({
                        link: '#/cc/characterizations/' + d.id,
                        label: d['name']
                    })),
                },
                {
                    title: 'Created',
                    className: this.classes('tbl-col', 'created'),
                    type: 'date',
                    render: datatableUtils.getDateFieldFormatter(),
                },
                {
                    title: 'Updated',
                    className: this.classes('tbl-col', 'updated'),
                    type: 'date',
                    render: datatableUtils.getDateFieldFormatter(),
                },
                {
                    title: 'Author',
                    className: this.classes('tbl-col', 'author'),
                    render: (s, p, d) => (d.createdBy !== null ? d.createdBy.login : 'anonymous'),
                },

            ];
            this.gridOptions = {
                Facets: [
                    {
                        'caption': 'Created',
                        'binding': (o) => datatableUtils.getFacetForDate(o.createdAt)
                    },
                    {
                        'caption': 'Updated',
                        'binding': (o) => datatableUtils.getFacetForDate(o.updatedAt)
                    },
                    {
                        'caption': 'Author',
                        'binding': o => (o.createdBy !== null ? o.createdBy.login : 'anonymous'),
                    },
                ]
            };

            this.isGetCCListPermitted() && this.loadData();
        }

        loadData() {
            this.loading(true);
            CharacterizationService
                .loadCharacterizationList()
                .then(res => {
                    this.data(res.content);
                    this.loading(false);
                });
        }

        createCharacterization() {
            commonUtils.routeTo('/cc/characterizations/0');
        }
    }

    return commonUtils.build('characterizations-list', Characterizations, view);
});