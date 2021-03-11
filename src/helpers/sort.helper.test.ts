import {
	asort,
	dsort,
} from './sort.helper';

describe('helper/sort', () => {
	const dataAsc = [
		{ order: 1 },
		{ order: 2 },
		{ order: 2 },
	];
	const dataDesc = [
		{ order: 2 },
		{ order: 2 },
		{ order: 1 },
	];
	describe('sort()', () => {
		it('Should sort asc data1', async () => {
			const result = asort(dataAsc, 'order');
			expect(result).toEqual(dataAsc);
		});
		it('Should sort asc data2', async () => {
			const result = asort(dataDesc, 'order');
			expect(result).toEqual(dataAsc);
		});
		it('Should sort desc data1', async () => {
			const result = dsort(dataAsc, 'order');
			expect(result).toEqual(dataDesc);
		});
		it('Should sort desc data2', async () => {
			const result = dsort(dataDesc, 'order');
			expect(result).toEqual(dataDesc);
		});
	});
});
