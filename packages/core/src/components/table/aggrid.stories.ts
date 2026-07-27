import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, createGrid, themeQuartz } from 'ag-grid-community';
// TODO: Resolve when updating ag-grid stories to one file system or when wrapper class removed
import { oTableTheme } from './aggridtheme.tsx';
import '/node_modules/flag-icons/css/flag-icons.min.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const meta: Meta = {
	title: 'Components/Table',
	parameters: {
		layout: 'fullscreen'
	}
};

export default meta;

const userData = {
	users: [
		{
			id: 1,
			name: 'Mark Ross',
			company: 'Genco Pura Olive Oil Company',
			country: { name: 'Portugal', flag: 'pt' },
			mobile: '(231) 638-1199'
		},
		{
			id: 2,
			name: 'Concepcion King',
			company: 'Globex Corporation',
			country: { name: 'Turkey', flag: 'tr' },
			mobile: '(490) 696-8066'
		},
		{
			id: 3,
			name: 'Vanecia Green',
			company: 'Soylent Corp',
			country: { name: 'Netherlands', flag: 'nl' },
			mobile: '(607) 248-2032'
		},
		{
			id: 4,
			name: 'Samara Anderson',
			company: 'Initech',
			country: { name: 'China', flag: 'cn' },
			mobile: '(423) 564-7972'
		},
		{
			id: 5,
			name: 'Maxine Hamilton',
			company: 'Gekko & Co',
			country: { name: 'Austria', flag: 'at' },
			mobile: '(413) 936-2806'
		},
		{
			id: 6,
			name: 'Dan Lee',
			company: 'Sterling Cooper',
			country: { name: 'Israel', flag: 'il' },
			mobile: '(612) 436-2728'
		},
		{
			id: 7,
			name: 'Paul Long',
			company: 'Hooli',
			country: { name: 'Brazil', flag: 'br' },
			mobile: '(588) 904-5858'
		},
		{
			id: 8,
			name: 'Madonna Snyder',
			company: 'Capital Partners',
			country: { name: 'Spain', flag: 'es' },
			mobile: '(540) 378-7248'
		},
		{
			id: 9,
			name: 'Oriole Perkins',
			company: 'Massive Dynamics',
			country: { name: 'Japan', flag: 'jp' },
			mobile: '(471) 646-1055'
		},
		{
			id: 10,
			name: 'Ernest Jordan',
			company: 'Wonka Industries',
			country: { name: 'Germany', flag: 'de' },
			mobile: '(309) 799-3429'
		}
	]
};

const CountryFormatter = (props: { value: { flag: string; name: string } }) => {
	const span = document.createElement('span');
	const icon = document.createElement('i');
	icon.className = `fi fi-${props.value.flag}`;
	span.appendChild(icon);
	span.appendChild(document.createTextNode(` ${props.value.name}`));
	return span;
};

const Template: StoryObj = {
	render: () => {
		const gridDiv = document.createElement('div');
		gridDiv.id = 'myGrid';
		gridDiv.style.height = '500px';
		gridDiv.style.width = '100%';
		gridDiv.style.padding = '1rem';

		document.body.appendChild(gridDiv);

		const gridOptions: GridOptions = {
			rowSelection: {
				mode: 'multiRow'
			},
			rowData: userData.users,
			columnDefs: [
				{ field: 'id' },
				{ field: 'name' },
				{ field: 'company' },
				{
					field: 'country',
					cellRenderer: CountryFormatter,
					valueFormatter: (params) => `${params.value.name}`
				},
				{ field: 'mobile' }
			],
			defaultColDef: {
				flex: 1
			},
			theme: themeQuartz.withParams(oTableTheme.getThemeProperties())
		};

		createGrid(gridDiv, gridOptions);

		const toggleButton = document.querySelector('.docblock-code-toggle') as HTMLElement;
		if (toggleButton) {
			toggleButton.style.display = 'none';
		}

		return gridDiv;
	}
};

export const Default = Template;


