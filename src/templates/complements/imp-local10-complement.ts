import { type CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { type Content, type TableCell, type TableLayout } from 'pdfmake/interfaces';
import { formatCurrency } from '../../utils/currency.js';

const tableLayoutBordered = (): TableLayout => {
  return {
    hLineWidth(i, node): number {
      if (i === 0 || i === node.table.body.length) {
        return 0.8;
      }

      return i === node.table.headerRows ? 0.8 : 0.5;
    },
    vLineWidth(i, node): number {
      return i === 0 || i === node.table.widths?.length ? 0.8 : 0;
    },
    hLineColor(i, node): string {
      return i === 0 || i === node.table.body.length ? 'black' : 'gray';
    },
    paddingLeft(i): number {
      return i === 0 ? 0 : 8;
    },
    paddingRight(i, node): number {
      return i === (node.table.widths?.length ?? 0) - 1 ? 0 : 8;
    },
  };
};

const useImpLocal10Complement = (comprobante: CNodeInterface, currentContent: Content[]): void => {
  // Verify if exists ImpLocal10 complement
  const impLocal10 = comprobante.searchNode('cfdi:Complemento', 'implocal:ImpuestosLocales');
  if (!impLocal10) return;

  const bodyImpLocal10: TableCell[][] = [];

  bodyImpLocal10.push(
    // Header imp local
    [
      {
        text: 'COMPLEMENTO IMPUESTOS LOCALES',
        style: 'tableHeader',
        colSpan: 4,
        alignment: 'center',
      },
      {},
      {},
      {},
    ],
    // SubHeader with values on implocal10
    [
      'TOTAL RETENCIONES:',
      formatCurrency(impLocal10.get('TotaldeRetenciones')),
      'TOTAL TRASLADOS:',
      formatCurrency(impLocal10.get('TotaldeTraslados')),
    ],
  );

  // If exists node retenciones locales
  const retencionesLocales = impLocal10.searchNode('implocal:RetencionesLocales');
  if (retencionesLocales) {
    bodyImpLocal10.push([
      {
        style: 'tableContent',
        margin: 3,
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {
                text: 'RETENCIONES LOCALES',
                style: 'tableHeader',
                colSpan: 3,
                alignment: 'center',
              },
              {},
              {},
            ],
            [
              {
                text: 'IMP LOCAL RETENIDO',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
              },
              {
                text: 'TASA DE RETENCIÓN',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
              },
              {
                text: 'IMPORTE',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
              },
            ],
            [
              retencionesLocales.get('ImpLocRetenido'),
              retencionesLocales.get('TasadeRetencion'),
              formatCurrency(retencionesLocales.get('Importe')),
            ],
          ],
        },
        layout: tableLayoutBordered(),
        colSpan: 4,
      },
      {},
      {},
      {},
    ]);
  }

  // If exists node traslados locales
  const trasladosLocales = impLocal10.searchNode('implocal:TrasladosLocales');
  if (trasladosLocales) {
    bodyImpLocal10.push([
      {
        style: 'tableContent',
        margin: 3,
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {
                text: 'TRASLADOS LOCALES',
                style: 'tableHeader',
                colSpan: 3,
                alignment: 'center',
              },
              {},
              {},
            ],
            [
              {
                text: 'IMP LOCAL TRASLADADO',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
              },
              {
                text: 'TASA DE TRASLADO',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
              },
              {
                text: 'IMPORTE',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
              },
            ],
            [
              trasladosLocales.get('ImpLocTrasladado'),
              trasladosLocales.get('TasadeTraslado'),
              formatCurrency(trasladosLocales.get('Importe')),
            ],
          ],
        },
        layout: tableLayoutBordered(),
        colSpan: 4,
      },
      {},
      {},
      {},
    ]);
  }

  currentContent.push(
    {
      style: 'tableContent',
      table: {
        widths: [95, '*', 95, '*'],
        body: bodyImpLocal10,
      },
      layout: tableLayoutBordered(),
    },
    '\n',
  );
};

export { useImpLocal10Complement };
