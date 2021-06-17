import React, { ReactElement } from 'react'
import { MDBDataTable } from 'mdbreact'

export default function Covid(): ReactElement {
	const [countries, setData] = React.useState<any[]>([])
	React.useEffect(() => {
		async function fetchData() {
			const res = await fetch(
				'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json'
			)
			const data = (await res.json()) as any
			const countries = Object.values(data)
				.filter(
					(d: any) =>
						d.continent !== null && d.new_cases_smoothed_per_million <= 40
				)
				.map((country: any) => ({
					location: country.location,
					new_cases_smoothed_per_million:
						country.new_cases_smoothed_per_million?.toLocaleString(),
					positive_rate: (country.positive_rate ?? 0).toLocaleString(),
					population: country.population ?? 0,
					people_fully_vaccinated_per_hundred: (
						country.people_fully_vaccinated_per_hundred ?? 0
					).toLocaleString(),
				}))
			setData(countries)
		}
		fetchData()
	}, [])
	const data = React.useMemo(
		() => ({
			columns: [
				{
					label: 'Country',
					field: 'location',
				},
				{
					label: '7 Day Avg New Cases Per 100mil',
					field: 'new_cases_smoothed_per_million',
				},
				{
					label: 'Positivty Rate',
					field: 'positive_rate',
				},
				{
					label: 'Population',
					field: 'population',
					sort: 'desc',
				},
				{
					label: 'Total Full Vaccination per 100k',
					field: 'people_fully_vaccinated_per_hundred',
				},
			],
			rows: countries,
		}),
		[countries]
	)
	return (
		<>
			<h1>Countries with less than 40 cases/million on a 7 day rolling avg</h1>
			<MDBDataTable
				striped
				bordered
				small
				data={data}
				entries={200}
				entriesOptions={[200]}
				order={['population', 'desc']}
			/>
			<h4>
				Data gathered from{' '}
				<a href='https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json'>
					Our world in Data
				</a>
			</h4>
		</>
	)
}
