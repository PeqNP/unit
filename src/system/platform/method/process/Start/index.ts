import { bundleSpec } from '../../../../../bundle'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { $Graph } from '../../../../../types/interface/async/$Graph'
import { $S } from '../../../../../types/interface/async/$S'
import { UCGEE } from '../../../../../types/interface/UCGEE'
import { weakMerge } from '../../../../../weakMerge'
import { $wrap } from '../../../../../wrap'
import { ID_START } from '../../../../_ids'

export interface I {
  graph: GraphBundle
  system: $S
  opt: {
    paused?: boolean
  }
}

export interface O {
  graph: $Graph
}

export default class Start extends Holder<I, O> {
  private _graph: $Graph

  constructor(system: System) {
    super(
      {
        fi: ['graph', 'system', 'opt'],
        fo: ['graph'],
        i: [],
        o: [],
      },
      {
        input: {
          system: {
            ref: true,
          },
        },
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_START
    )
  }

  f({ graph: Graph, system, opt }: I, done: Done<O>): void {
    const { paused } = opt || {}

    const { __bundle } = Graph

    const id = __bundle.unit.id

    const spec = (this.__system.getSpec(id) ?? __bundle.specs[id]) as GraphSpec

    const bundle = bundleSpec(
      spec,
      weakMerge(__bundle.specs, this.__system.specs)
    )

    const $graph = system.$start({ bundle })

    const graph = $wrap<$Graph>(this.__system, $graph, UCGEE)

    if (!paused) {
      graph.$play({})
    }

    this._graph = graph

    done({ graph })
  }

  d() {
    if (this._graph) {
      this._graph.$destroy({})

      this._graph = undefined
    }
  }
}
