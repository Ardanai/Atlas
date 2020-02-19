define([
	'knockout',
	'components/Component',
	'utils/CommonUtils',
	'lodash',
	'xss',
	'appConfig',
	'text!./linked-cohort-list.html',
	'components/cohort-definition-browser',
	'less!./linked-cohort-list.less',
	'components/linked-entity-list',
	'components/modal',
	'databindings'
], function (
	ko,
	Component,
	commonUtils,
	lodash,
	filterXSS,
	appConfig,
	view
) {
	class LinkedCohortList extends Component {
		constructor(params) {
			super();

			this.showCohortModal = this.showCohortModal.bind(this);
			this.removeCohort = this.removeCohort.bind(this);

			const nameCol = {
				title: ko.i18n('components.linked-cohort-list.table.columns.name', 'Name')
			};

			if (params.canEditName) {
				nameCol.render = (s,p,d) =>  p === 'display' ? `<span data-bind="clickToEdit: name" />` : ko.utils.unwrapObservable(d.name);
				nameCol.className = this.classes('col-cohort-name', 'editable');
			} else {
				nameCol.data = 'name';
				nameCol.render = (s,p,d) => {
					const name = ko.utils.unwrapObservable(d.name);
					if (p === 'display') {
						return filterXSS(name, appConfig.strictXSSOptions);
					}
					return name;
				};
				nameCol.className = this.classes('col-cohort-name');
			}

			// Linked entity list props
			this.title = params.title || ko.i18n('components.linked-cohort-list.defaultTitle', 'Cohort definition');
			this.descr = params.descr;
			this.newItemLabel = params.newItemLabel || ko.i18n('components.linked-cohort-list.defaultNewItemLabel', 'Import');
			this.newItemAction = params.newItemAction || this.showCohortModal;
			this.data = params.data || ko.observable([]);
			this.columns = params.columns || [
				{
					title: ko.i18n('components.linked-cohort-list.table.columns.id', 'ID'),
					data: 'id',
					className: this.classes('col-cohort-id'),
				},
				nameCol,
				{
					title: '',
					render: this.getEditCell('editCohort'),
					className: this.classes('col-cohort-edit'),
				},
				{
					title: '',
					render: this.getRemoveCell('removeCohort'),
					className: this.classes('col-cohort-remove'),
				},

			];

			// Modal props
			this.showModal = ko.observable(false);
			this.cohortSelected = ko.observable();

			// subscriptions
			this.subscriptions.push(this.cohortSelected.subscribe(cohort => this.attachCohort(cohort)));
		}

		getRemoveCell(action, identifierField = 'id') {
			return (s, p, d) => {
				return `<a href='#' data-bind="click: () => $component.params.${action}('${d[identifierField]}')">${ko.i18n('components.linked-cohort-list.table.actions.remove', 'Remove')()}</a>`;
			}
		}

		getEditCell(action, identifierField = 'id') {
			return (s, p, d) => {
				return `<a href="#/cohortdefinition/${d[identifierField]}">${ko.i18n('components.linked-cohort-list.table.actions.edit', 'Edit cohort')()}</a>`;
			}
		}


		showCohortModal() {
			this.showModal(true);
		}

		attachCohort({ id, name }) {
			const data = this.data();
			this.showModal(false);
			this.data(
				lodash.uniqBy(
					[
						...data,
						{ id, name }
					],
					'id'
				).map(d => { d.name = ko.observable(ko.utils.unwrapObservable(d.name)); return d})
			);
		}

		removeCohort(id) {
			this.data(this.data().filter(a => a.id !== parseInt(id)));
		}

	}

	return commonUtils.build('linked-cohort-list', LinkedCohortList, view);
});
