import heapq
class Union:



    def __init__(self, n):
        self.parent = [i for i in range(n + 1)]
        self.rank = [0] * (n + 1)

    def find(self, u):


        if self.parent[u] != u:

            
            self.parent[u] = self.find(self.parent[u])

        return self.parent[u]

    def union(self, u, v):

        root_u = self.find(u)
        root_v = self.find(v)

        if root_u == root_v:
  
            return False

        if self.rank[root_u] < self.rank[root_v]:
  
            self.parent[root_u] = root_v
        elif self.rank[root_u] > self.rank[root_v]:
  
            self.parent[root_v] = root_u
        else:
  
            self.parent[root_v] = root_u
  
            self.rank[root_u] += 1
  
        return True


def kruskal(n, edges):

    #initialze the variables
    total_weight = 0
    min_heap = []
    uf = Union(n)
    mst_edges = []

    dist=edges

    for u, v, weight in dist:
        heapq.heappush(min_heap, (weight, u, v))

    #min heap prepared
    #for weight, u, v in min_heap:
    #   if uf.find(u) != uf.find(v):
    #       uf.union(u, v)
            #continue


    for _ in range(len(min_heap)):
        weight, u, v = heapq.heappop(min_heap)
        heap = (u,v,weight)
        if uf.union(u, v):
            total_weight += weight
            mst_edges.append(heap)

    return total_weight, mst_edges

edges = [(1, 2, 1), (2, 3, 2), (2, 4, 4), (1, 4, 5), (1, 3, 3)]
n = 4

cost, mst = kruskal(n, edges)

for edge in mst:
    print(edge)

print("Total minimum cost:", cost)
    