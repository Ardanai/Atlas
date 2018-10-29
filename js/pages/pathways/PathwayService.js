define([
    'services/http',
    'appConfig',
], function (
	httpService,
	config,
) {
	const servicePath = config.webAPIRoot + 'pathway-analysis';

	function list(params) {
		return httpService.doGet(servicePath, params)
	}

	function create(design) {
		return request = httpService.doPost(servicePath, design).then(res => res.data);
	}

	function load(id) {
		return httpService
			.doGet(`${servicePath}/${id}`)
			.then(res => res.data);
	}

	function save(id, design) {
		return httpService.doPut(`${servicePath}/${id}`, design).then(res => res.data);
	}

	function del(id) {
		return httpService
			.doDelete(`${servicePath}/${id}`)
			.then(res => res.data);
	}

	function listExecutions(id) {
		return httpService
			.doGet(`${servicePath}/${id}/generation`)
			.then(res => res.data);
	}

	function getExecution(id) {
		return httpService
			.doGet(`${servicePath}/generation/${id}`)
			.then(res => res.data);
	}

	function getResults(generationId) {
		return httpService
			.doGet(`${servicePath}/generation/${generationId}/result`)
			.then(res => res.data);
	}

	function generate(id, sourcekey) {
		return httpService
			.doPost(`${servicePath}/${id}/generation/${sourcekey}`)
			.then(res => res.data);
	}
	
	function loadExportDesign(id) {
		return httpService
			.doGet(`${servicePath}/${id}/export`)
			.then(res => res.data);
	}
	
	function loadExportDesignByGeneration(generationId) {
		return httpService
			.doGet(`${servicePath}/generation/${generationId}/design`)
			.then(res => res.data);
	}
	
	function importPathwayDesign(design) {
		return httpService
			.doPost(`${servicePath}/import`, design)
			.then(res => res.data);
	}	

	return {
		list,
		create,
		load,
		save,
		del,
		listExecutions,
		getExecution,
		getResults,
		generate,
		loadExportDesign,
		loadExportDesignByGeneration,
		importPathwayDesign
	};
});