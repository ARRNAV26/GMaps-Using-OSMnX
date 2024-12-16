from django.shortcuts import render
import osmnx as ox
import networkx as nx
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import JsonResponse
from rest_framework.viewsets import ViewSet


class ShortestPathViewSet(ViewSet):
    def list(self, request):
        try:
            # Get query parameters
            src_lat = float(request.query_params.get('src_lat'))
            src_lng = float(request.query_params.get('src_lng'))
            dst_lat = float(request.query_params.get('dst_lat'))
            dst_lng = float(request.query_params.get('dst_lng'))
            print("Coordinates:  ", src_lat, src_lng, dst_lat, dst_lng)
            # Validate latitude and longitude
            if not (-90 <= src_lat <= 90 and -180 <= src_lng <= 180):
                return Response({"error": "Invalid source coordinates."}, status=400)
            if not (-90 <= dst_lat <= 90 and -180 <= dst_lng <= 180):
                return Response({"error": "Invalid destination coordinates."}, status=400)

            # Load the graph from the source point
            G = ox.graph_from_point((src_lat, src_lng), dist=5000, network_type="drive")
            if G is None or len(G) == 0:
                return Response({"error": "No road network found near the source location."}, status=400)

            # Find the nearest nodes to the source and destination
            src_node = ox.distance.nearest_nodes(G, X=src_lng, Y=src_lat)
            dst_node = ox.distance.nearest_nodes(G, X=dst_lng, Y=dst_lat)

            # Get the shortest path between the nodes
            shortest_path = nx.shortest_path(G, src_node, dst_node, weight="length")
            if not shortest_path:
                return Response({"error": "No path found between the given locations."}, status=400)

            # Calculate the total route length
            route_length = 0
            for u, v in zip(shortest_path[:-1], shortest_path[1:]):
                # Get the edge data for each segment
                edge_data = G.get_edge_data(u, v, default={})
                route_length += edge_data.get("length", 0)

            # Get route nodes' coordinates
            route_nodes = [
                {"lat": G.nodes[node]["y"], "lng": G.nodes[node]["x"]}
                for node in shortest_path
            ]

            # Construct response data
            response_data = {
                "source": {"lat": src_lat, "lng": src_lng},
                "destination": {"lat": dst_lat, "lng": dst_lng},
                "route_length": route_length,
                "route_nodes": route_nodes,
            }
            return Response(response_data)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

