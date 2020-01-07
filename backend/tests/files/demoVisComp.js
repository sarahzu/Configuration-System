import React from "react";


/**
 * Pie chart
 *
 * @visComp
 * @props {integer} breakpoint [480]
 * @props {integer} chartWidth [200]
 * @props {string} legendPosition [bottom]
 *
 * @props {dynamic} modelA [aum.mfa.out.PublicVehicles] (aum.mfa.out.PublicVehicles.name)
 * @props {dynamic} modelB [aum.mfa.out.PrivateVehicles] (aum.mfa.out.PrivateVehicles.name)
 * @props {dynamic} modelC [aum.mfa.out.OtherBuildings] (aum.mfa.out.OtherBuildings.name)
 * @props {dynamic} modelD [aum.mfa.out.ResidentialBuildings] (aum.mfa.out.ResidentialBuildings.name)
 * @props {dynamic} modelE [aum.mfa.out.Industry] (aum.mfa.out.Industry.name)
 *
 * @props {dependent} valueA [44] {modelA--value.10.value}
 * @props {dependent} valueB [55] {modelB--value.10.value}
 * @props {dependent} valueC [55] {modelC--value.10.value}
 * @props {dependent} valueD [43] {modelD--value.10.value}
 * @props {dependent} valueE [22] {modelE--value.10.value}
 *
 * @props {dependent} click [777] {getValue--value.1.value}
 * @props {callback} getValue [DecisionCard] (aum.mfa.in.PublicVehicles.name)
 */
class PieChart extends React.Component {

}

/**
 * Some other chart, should not be found
 *
 * @param something
 *
 *
 *
 * @props {string} title [Stock in Tons of Materials]
 * @props {string} firstFillStyle [verticalLines]
 * @props {string} secondFillStyle [squares]
 * @props {string} thirdFillStyle [horizontalLines]
 * @props {string} fourthFillStyle [circles]
 * @props {string} fiftFillStyle [slantedLines]
 *
 * @props {dynamic} modelA [aum.mfa.out.PublicVehicles] (aum.mfa.out.PublicVehicles.name)
 * @props {dynamic} modelB [aum.mfa.out.PrivateVehicles] (aum.mfa.out.PrivateVehicles.name)
 * @props {dynamic} modelC [aum.mfa.out.OtherBuildings] (aum.mfa.out.OtherBuildings.name)
 * @props {dynamic} modelD [aum.mfa.out.ResidentialBuildings] (aum.mfa.out.ResidentialBuildings.name)
 * @props {dynamic} modelE [aum.mfa.out.Industry] (aum.mfa.out.Industry.name)
 *
 * @props {dependent} valueA [24] {modelA--value.1.value}
 * @props {dependent} valueB [75] {modelB--value.1.value}
 * @props {dependent} valueC [95] {modelC--value.1.value}
 * @props {dependent} valueD [43] {modelD--value.1.value}
 * @props {dependent} valueE [42] {modelE--value.1.value}
 */
class DonutChart2 extends React.Component {

}

/**
 * This comp should not be found
 *
 * @param blabla
 * @param blabla
 * @props uhhu
 */
class Nothing extends React.Component {

}