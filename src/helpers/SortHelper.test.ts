import { asort, dsort } from './SortHelper';

describe('helpers/dynamo', () => {
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
	describe('asort()', () => {
		it('Should sort asc data1', async () => {
			const result = asort(dataAsc, 'order');
			expect(result).toEqual(dataAsc);
		});
		it('Should sort asc data2', async () => {
			const result = asort(dataDesc, 'order');
			expect(result).toEqual(dataAsc);
		});
	});
	describe('dsort()', () => {
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
