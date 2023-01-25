import FastPriorityQueue from 'fastpriorityqueue'

class Node{
    constructor(state, distance, parent){
      this.state = state;
      this.distance = distance;
      this.parent = parent;
    }
}

const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function emptyPos(node) {
    if (node.state[0] == 0) {return 0;}
    else if (node.state[1] == 0) {return 1;}
    else if (node.state[2] == 0) {return 2;}
    else if (node.state[3] == 0) {return 3;}
    else if (node.state[4] == 0) {return 4;}
    else if (node.state[5] == 0) {return 5;}
    else if (node.state[6] == 0) {return 6;}
    else if (node.state[7] == 0) {return 7;}
    else if (node.state[8] == 0) {return 8;}
}

function CompareNodesh2(n1, n2){
    var h_node1 = 0;
    var h_node2 = 0;

    var state1 = [[n1.state[0], n1.state[1], n1.state[2]],
                        [n1.state[3], n1.state[4], n1.state[5]],
                        [n1.state[6], n1.state[7], n1.state[8]] ]
    var state2 = [[n2.state[0], n2.state[1], n2.state[2]],
                        [n2.state[3], n2.state[4], n2.state[5]],
                        [n2.state[6], n2.state[7], n2.state[8]]]

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var val = state1[i][j];
            var manhattan1 = 0;
            switch (val) {
            case 1:
            {
                var distance_x = Math.abs(j - 0);
                var distance_y = Math.abs(i - 0);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 2:
            {
                var distance_x = Math.abs(j - 1);
                var distance_y = Math.abs(i - 0);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 3:
            {
                var distance_x = Math.abs(j - 2);
                var distance_y = Math.abs(i - 0);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 4:
            {
                var distance_x = Math.abs(j - 0);
                var distance_y = Math.abs(i - 1);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 5:
            {
                var distance_x = Math.abs(j - 1);
                var distance_y = Math.abs(i - 1);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 6:
            {
                var distance_x = Math.abs(j - 2);
                var distance_y = Math.abs(i - 1);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 7:
            {
                var distance_x = Math.abs(j - 0);
                var distance_y = Math.abs(i - 2);
                manhattan1 += distance_x + distance_y;
            }
            break;
            case 8:
            {
                var distance_x = Math.abs(j - 1);
                var distance_y = Math.abs(i - 2);
                manhattan1 += distance_x + distance_y;
            }
            break;
            }
            h_node1 += manhattan1;

            var val2 = state2[i][j];
            var manhattan2 = 0;
            switch (val2) {
            case 1:
            {
                var distance_x = Math.abs(j - 0);
                var distance_y = Math.abs(i - 0);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 2:
            {
                var distance_x = Math.abs(j - 1);
                var distance_y = Math.abs(i - 0);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 3:
            {
                var distance_x = Math.abs(j - 2);
                var distance_y = Math.abs(i - 0);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 4:
            {
                var distance_x = Math.abs(j - 0);
                var distance_y = Math.abs(i - 1);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 5:
            {
                var distance_x = Math.abs(j - 1);
                var distance_y = Math.abs(i - 1);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 6:
            {
                var distance_x = Math.abs(j - 2);
                var distance_y = Math.abs(i - 1);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 7:
            {
                var distance_x = Math.abs(j - 0);
                var distance_y = Math.abs(i - 2);
                manhattan2 += distance_x + distance_y;
            }
            break;
            case 8:
            {
                var distance_x = Math.abs(j - 1);
                var distance_y = Math.abs(i - 2);
                manhattan2 += distance_x + distance_y;
            }
            break;
            }
            h_node2 += manhattan2;
        }
    }

    var lhs = n1.distance + h_node1;
    var rhs = n2.distance + h_node2;

    return lhs < rhs;
}

export function Astarsearch(currentState){
    var queue = new FastPriorityQueue(CompareNodesh2)
    var visited = new Set()
    var start = new Node(currentState, 0, null);
    var goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    queue.add(start);
    while(!queue.isEmpty()){
      var current = queue.poll()
      if(equals(current.state, goal)){
        return current
      }
      var empty_pos = emptyPos(current)
      if(!visited.has(current)){
      switch(empty_pos){
        case 0:
          var newState1 = current.state.slice()
          newState1[0] = newState1[1];
          newState1[1] = 0;
          var newNode1 = new Node(newState1, current.distance+1, current)
          queue.add(newNode1)

          var newState2 = current.state.slice()
          newState2[0] = newState2[3];
          newState2[3] = 0;
          var newNode2 = new Node(newState2, current.distance+1, current)
          queue.add(newNode2)
          break;
        case 1:
          var newState3 = current.state.slice()
          newState3[1] = newState3[0];
          newState3[0] = 0;
          var newNode3 = new Node(newState3, current.distance+1, current)
          queue.add(newNode3)

          var newState4 = current.state.slice()
          newState4[1] = newState4[4]
          newState4[4] = 0
          var newNode4 = new Node(newState4, current.distance+1, current)
          queue.add(newNode4)

          var newState5 = current.state.slice()
          newState5[1] = newState5[2]
          newState5[2] = 0
          var newNode5 = new Node(newState5, current.distance+1, current)
          queue.add(newNode5)
          break;
        case 2:
            var newState6 = current.state.slice()
            newState6[2] = newState6[1];
            newState6[1] = 0;
            var newNode6 = new Node(newState6, current.distance+1, current)
            queue.add(newNode6)
  
            var newState7 = current.state.slice()
            newState7[2] = newState7[5];
            newState7[5] = 0;
            var newNode7 = new Node(newState7, current.distance+1, current)
            queue.add(newNode7)
            break;
        case 3:
              var newState8 = current.state.slice()
              newState8[3] = newState8[0];
              newState8[0] = 0;
              var newNode8 = new Node(newState8, current.distance+1, current)
              queue.add(newNode8)
    
              var newState9 = current.state.slice()
              newState9[3] = newState9[4]
              newState9[4] = 0
              var newNode9 = new Node(newState9, current.distance+1, current)
              queue.add(newNode9)
    
              var newState10 = current.state.slice()
              newState10[3] = newState10[6]
              newState10[6] = 0
              var newNode10 = new Node(newState10, current.distance+1, current)
              queue.add(newNode10)
              break;    
         case 4:
                var newState11 = current.state.slice()
                newState11[4] = newState11[3];
                newState11[3] = 0;
                var newNode11 = new Node(newState11, current.distance+1, current)
                queue.add(newNode11)
      
                var newState12 = current.state.slice()
                newState12[4] = newState12[1]
                newState12[1] = 0
                var newNode12 = new Node(newState12, current.distance+1, current)
                queue.add(newNode12)
      
                var newState13 = current.state.slice()
                newState13[4] = newState13[5]
                newState13[5] = 0
                var newNode13 = new Node(newState13, current.distance+1, current)
                queue.add(newNode13)

                var newState14 = current.state.slice()
                newState14[4] = newState14[7]
                newState14[7] = 0
                var newNode14 = new Node(newState14, current.distance+1, current)
                queue.add(newNode14)
                break;  
          case 5:
              var newState15 = current.state.slice()
              newState15[5] = newState15[2];
              newState15[2] = 0;
              var newNode15 = new Node(newState15, current.distance+1, current)
              queue.add(newNode15)
    
              var newState16 = current.state.slice()
              newState16[5] = newState16[4]
              newState16[4] = 0
              var newNode16 = new Node(newState16, current.distance+1, current)
              queue.add(newNode16)
    
              var newState17 = current.state.slice()
              newState17[5] = newState17[8]
              newState17[8] = 0
              var newNode17 = new Node(newState17, current.distance+1, current)
              queue.add(newNode17)
              break;  
         case 6:
            var newState18 = current.state.slice()
            newState18[6] = newState18[3];
            newState18[3] = 0;
            var newNode18 = new Node(newState18, current.distance+1, current)
            queue.add(newNode18)
  
            var newState19 = current.state.slice()
            newState19[6] = newState19[7];
            newState19[7] = 0;
            var newNode19 = new Node(newState19, current.distance+1, current)
            queue.add(newNode19)
            break;   
        case 7:
              var newState20 = current.state.slice()
              newState20[7] = newState20[6];
              newState20[6] = 0;
              var newNode20 = new Node(newState20, current.distance+1, current)
              queue.add(newNode20)
    
              var newState21 = current.state.slice()
              newState21[7] = newState21[4]
              newState21[4] = 0
              var newNode21 = new Node(newState21, current.distance+1, current)
              queue.add(newNode21)
    
              var newState22 = current.state.slice()
              newState22[7] = newState22[8]
              newState22[8] = 0
              var newNode22 = new Node(newState22, current.distance+1, current)
              queue.add(newNode22)
              break;  
        case 8:
            var newState23 = current.state.slice()
            newState23[8] = newState23[7];
            newState23[7] = 0;
            var newNode23 = new Node(newState23, current.distance+1, current)
            queue.add(newNode23)
  
            var newState24 = current.state.slice()
            newState24[8] = newState24[5];
            newState24[5] = 0;
            var newNode24 = new Node(newState24, current.distance+1, current)
            queue.add(newNode24)
            break;                          
      }
      visited.add(current)
    }

    }

  }